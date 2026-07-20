import type {
	GetParameterCommandOutput,
	SSMClientConfig,
} from "@aws-sdk/client-ssm";
import { expect, test } from "@playwright/test";
import {
	getYouTubePlaylistRequest,
	methodNotAllowedRequest,
} from "@/src/routes/api.youtube-playlist";
import {
	createYouTubeApiKeyReader,
	fetchYouTubePlaylist,
	handleYouTubePlaylistRequest,
	type YouTubePlaylistDependencies,
	youtubePlaylistErrorCacheControl,
	youtubePlaylistSuccessCacheControl,
} from "@/utils/youtube-playlist.server";
import {
	youtubeApiKeyParameterName,
	youtubePlaylistId,
} from "@/utils/youtube-playlist-config";
import {
	formatYouTubeDuration,
	selectYouTubeThumbnail,
} from "@/utils/youtube-playlist-data";

const secretApiKey = "test-youtube-secret-key";

const playlistMetadataResponse = {
	items: [{ id: youtubePlaylistId, snippet: { title: "Arias" } }],
};

const playlistItem = (
	videoId: string,
	position: number,
	title = `Video ${position + 1}`,
) => ({
	contentDetails: { videoId },
	snippet: {
		position,
		title,
		resourceId: { videoId },
		thumbnails: {
			medium: {
				url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
				width: 320,
				height: 180,
			},
		},
	},
});

const videoDetails = (
	videoId: string,
	{
		duration = "PT5M8S",
		embeddable = true,
		madeForKids = false,
		privacyStatus = "public",
	}: {
		duration?: string;
		embeddable?: boolean;
		madeForKids?: boolean;
		privacyStatus?: string;
	} = {},
) => ({
	id: videoId,
	contentDetails: { duration },
	status: { embeddable, madeForKids, privacyStatus },
});

const requestUrl = (input: string | URL | Request): URL => {
	if (input instanceof Request) return new URL(input.url);
	return new URL(input.toString());
};

const endpointRequest = (search = ""): { request: Request } => ({
	request: new Request(`http://localhost/api/youtube-playlist${search}`),
});

const createDependencies = (
	fetchImplementation: YouTubePlaylistDependencies["fetch"],
	messages: string[] = [],
): YouTubePlaylistDependencies => ({
	readApiKey: async () => secretApiKey,
	fetch: fetchImplementation,
	timeoutMilliseconds: 100,
	logger: { error: (message) => messages.push(message) },
});

const defaultFetch: YouTubePlaylistDependencies["fetch"] = async (input) => {
	const url = requestUrl(input);
	if (url.pathname.endsWith("/playlists")) {
		return Response.json(playlistMetadataResponse);
	}
	if (url.pathname.endsWith("/playlistItems")) {
		return Response.json({ items: [playlistItem("video-1", 0)] });
	}
	if (url.pathname.endsWith("/videos")) {
		return Response.json({ items: [videoDetails("video-1")] });
	}
	return new Response(null, { status: 404 });
};

test("retrieves the API key from the exact SSM SecureString with decryption", async () => {
	let configuration: SSMClientConfig | undefined;
	let commandInput: { Name?: string; WithDecryption?: boolean } | undefined;
	const readApiKey = createYouTubeApiKeyReader({
		environment: {
			AWS_REGION: "us-west-2",
			YOUTUBE_API_KEY_PARAMETER: youtubeApiKeyParameterName,
		},
		clientFactory: (clientConfiguration) => {
			configuration = clientConfiguration;
			return {
				send: async (command): Promise<GetParameterCommandOutput> => {
					commandInput = command.input;
					return {
						Parameter: { Type: "SecureString", Value: secretApiKey },
						$metadata: {},
					};
				},
			};
		},
	});

	await expect(readApiKey()).resolves.toBe(secretApiKey);
	expect(configuration).toEqual({ region: "us-west-2" });
	expect(commandInput).toEqual({
		Name: youtubeApiKeyParameterName,
		WithDecryption: true,
	});
});

test("rejects a plaintext SSM parameter", async () => {
	const readApiKey = createYouTubeApiKeyReader({
		environment: { YOUTUBE_API_KEY_PARAMETER: youtubeApiKeyParameterName },
		clientFactory: () => ({
			send: async (): Promise<GetParameterCommandOutput> => ({
				Parameter: { Type: "String", Value: secretApiKey },
				$metadata: {},
			}),
		}),
	});

	await expect(readApiKey()).rejects.toThrow("must be a SecureString");
});

test("uses only the server-side local API key fallback when no parameter is configured", async () => {
	let createdClient = false;
	const readApiKey = createYouTubeApiKeyReader({
		environment: { YOUTUBE_API_KEY: secretApiKey },
		clientFactory: () => {
			createdClient = true;
			return {
				send: async (): Promise<GetParameterCommandOutput> => ({
					$metadata: {},
				}),
			};
		},
	});

	await expect(readApiKey()).resolves.toBe(secretApiKey);
	expect(createdClient).toBe(false);
});

test("rejects missing or unexpected API key configuration", async () => {
	await expect(
		createYouTubeApiKeyReader({ environment: {} })(),
	).rejects.toThrow("not configured");
	await expect(
		createYouTubeApiKeyReader({
			environment: { YOUTUBE_API_KEY_PARAMETER: "/unexpected/parameter" },
		})(),
	).rejects.toThrow("not configured correctly");
});

test("sends the API key only in the Google API key header", async () => {
	const urls: string[] = [];
	const apiKeyHeaders: (string | null)[] = [];
	const dependencies = createDependencies(async (input, init) => {
		const url = requestUrl(input);
		urls.push(url.toString());
		apiKeyHeaders.push(new Headers(init?.headers).get("x-goog-api-key"));
		return defaultFetch(input, init);
	});

	await fetchYouTubePlaylist(dependencies);
	expect(urls).toHaveLength(3);
	for (const url of urls) expect(url).not.toContain(secretApiKey);
	expect(apiKeyHeaders).toEqual([secretApiKey, secretApiKey, secretApiKey]);
});

test("paginates playlist items and batches videos in groups of 50", async () => {
	const items = Array.from({ length: 51 }, (_, index) =>
		playlistItem(`video-${index + 1}`, index),
	);
	const requests: URL[] = [];
	const dependencies = createDependencies(async (input) => {
		const url = requestUrl(input);
		requests.push(url);
		if (url.pathname.endsWith("/playlists")) {
			return Response.json(playlistMetadataResponse);
		}
		if (url.pathname.endsWith("/playlistItems")) {
			return url.searchParams.get("pageToken") === "page-2"
				? Response.json({ items: items.slice(50) })
				: Response.json({ items: items.slice(0, 50), nextPageToken: "page-2" });
		}
		if (url.pathname.endsWith("/videos")) {
			const ids = url.searchParams.get("id")?.split(",") ?? [];
			return Response.json({ items: ids.map((id) => videoDetails(id)) });
		}
		return new Response(null, { status: 404 });
	});

	const playlist = await fetchYouTubePlaylist(dependencies);
	const itemRequests = requests.filter(({ pathname }) =>
		pathname.endsWith("/playlistItems"),
	);
	const videosRequests = requests.filter(({ pathname }) =>
		pathname.endsWith("/videos"),
	);

	expect(itemRequests).toHaveLength(2);
	expect(itemRequests[0]?.searchParams.get("maxResults")).toBe("50");
	expect(itemRequests[1]?.searchParams.get("pageToken")).toBe("page-2");
	expect(videosRequests).toHaveLength(2);
	expect(
		videosRequests.map((url) => url.searchParams.get("id")?.split(",").length),
	).toEqual([50, 1]);
	expect(playlist.videos).toHaveLength(51);
	expect(playlist.videos.map(({ id }) => id)).toEqual(
		items.map(({ contentDetails }) => contentDetails.videoId),
	);
});

test("preserves playlist positions when joining video details", async () => {
	const dependencies = createDependencies(async (input) => {
		const url = requestUrl(input);
		if (url.pathname.endsWith("/playlists")) {
			return Response.json(playlistMetadataResponse);
		}
		if (url.pathname.endsWith("/playlistItems")) {
			return Response.json({
				items: [playlistItem("video-b", 1), playlistItem("video-a", 0)],
			});
		}
		if (url.pathname.endsWith("/videos")) {
			return Response.json({
				items: [videoDetails("video-b"), videoDetails("video-a")],
			});
		}
		return new Response(null, { status: 404 });
	});

	await expect(fetchYouTubePlaylist(dependencies)).resolves.toMatchObject({
		videos: [{ id: "video-a" }, { id: "video-b" }],
	});
});

test("formats ISO-8601 durations for minutes, hours, and days", () => {
	expect(formatYouTubeDuration("PT5M8S")).toBe("5:08");
	expect(formatYouTubeDuration("PT1H2M3S")).toBe("1:02:03");
	expect(formatYouTubeDuration("P1DT2H")).toBe("26:00:00");
	expect(() => formatYouTubeDuration("five minutes")).toThrow(
		"ISO-8601 duration",
	);
});

test("prefers 16:9 max-resolution and medium thumbnails", () => {
	const medium = {
		name: "medium",
		url: "https://i.ytimg.com/medium.jpg",
		width: 320,
		height: 180,
	};
	const high = {
		name: "high",
		url: "https://i.ytimg.com/high.jpg",
		width: 480,
		height: 360,
	};
	const maxres = {
		name: "maxres",
		url: "https://i.ytimg.com/maxres.jpg",
		width: 1280,
		height: 720,
	};

	expect(selectYouTubeThumbnail([high, medium])).toBe(medium.url);
	expect(selectYouTubeThumbnail([medium, maxres])).toBe(maxres.url);
});

test("omits deleted and private entries while retaining non-embeddable videos", async () => {
	const dependencies = createDependencies(async (input) => {
		const url = requestUrl(input);
		if (url.pathname.endsWith("/playlists")) {
			return Response.json(playlistMetadataResponse);
		}
		if (url.pathname.endsWith("/playlistItems")) {
			return Response.json({
				items: [
					playlistItem("playable", 0),
					playlistItem("external-only", 1),
					playlistItem("deleted", 2, "Deleted video"),
					playlistItem("private", 3),
					{ snippet: { position: 4, title: null } },
				],
			});
		}
		if (url.pathname.endsWith("/videos")) {
			return Response.json({
				items: [
					videoDetails("playable", { madeForKids: true }),
					videoDetails("external-only", { embeddable: false }),
					videoDetails("private", { privacyStatus: "private" }),
				],
			});
		}
		return new Response(null, { status: 404 });
	});

	const playlist = await fetchYouTubePlaylist(dependencies);
	expect(playlist.unavailableCount).toBe(3);
	expect(playlist.videos).toEqual([
		expect.objectContaining({
			id: "playable",
			embeddable: true,
			madeForKids: true,
		}),
		expect.objectContaining({
			id: "external-only",
			embeddable: false,
			madeForKids: false,
			watchUrl: "https://www.youtube.com/watch?v=external-only",
		}),
	]);
});

test("returns successful cache headers through the GET route adapter", async () => {
	const response = await getYouTubePlaylistRequest(
		endpointRequest(),
		createDependencies(defaultFetch),
	);

	expect(response.status).toBe(200);
	expect(response.headers.get("cache-control")).toBe(
		youtubePlaylistSuccessCacheControl,
	);
	await expect(response.json()).resolves.toMatchObject({
		id: youtubePlaylistId,
		title: "Arias",
		unavailableCount: 0,
		videos: [{ id: "video-1", duration: "5:08" }],
	});
});

test("rejects query parameters without calling Google", async () => {
	let fetchCalls = 0;
	const response = await getYouTubePlaylistRequest(
		endpointRequest("?playlistId=another-playlist"),
		createDependencies(async () => {
			fetchCalls += 1;
			return new Response(null, { status: 500 });
		}),
	);

	expect(response.status).toBe(400);
	expect(response.headers.get("cache-control")).toBe(
		youtubePlaylistErrorCacheControl,
	);
	expect(fetchCalls).toBe(0);
});

test("returns GET-only 405 responses without caching", async () => {
	const response = methodNotAllowedRequest();

	expect(response.status).toBe(405);
	expect(response.headers.get("allow")).toBe("GET");
	expect(response.headers.get("cache-control")).toBe(
		youtubePlaylistErrorCacheControl,
	);
});

test("sanitizes missing configuration failures and never logs the API key", async () => {
	const messages: string[] = [];
	const response = await handleYouTubePlaylistRequest({
		...createDependencies(defaultFetch, messages),
		readApiKey: createYouTubeApiKeyReader({ environment: {} }),
	});
	const responseText = await response.text();

	expect(response.status).toBe(500);
	expect(response.headers.get("cache-control")).toBe(
		youtubePlaylistErrorCacheControl,
	);
	expect(responseText).toBe(
		JSON.stringify({ error: "YouTube playlist is unavailable" }),
	);
	expect(`${responseText} ${messages.join(" ")}`).not.toContain(secretApiKey);
});

test("sanitizes upstream failures without returning or logging the API key", async () => {
	const messages: string[] = [];
	const response = await handleYouTubePlaylistRequest(
		createDependencies(async () => {
			throw new Error(`Failed request with ${secretApiKey}`);
		}, messages),
	);
	const responseText = await response.text();

	expect(response.status).toBe(502);
	expect(response.headers.get("cache-control")).toBe(
		youtubePlaylistErrorCacheControl,
	);
	expect(responseText).toBe(
		JSON.stringify({ error: "YouTube playlist is temporarily unavailable" }),
	);
	expect(`${responseText} ${messages.join(" ")}`).not.toContain(secretApiKey);
});

test("aborts timed-out upstream requests with a sanitized 502", async () => {
	const messages: string[] = [];
	const dependencies = createDependencies(async (_input, init) => {
		return new Promise<Response>((_resolve, reject) => {
			init?.signal?.addEventListener("abort", () => {
				reject(new Error(`Timed out with ${secretApiKey}`));
			});
		});
	}, messages);
	dependencies.timeoutMilliseconds = 1;

	const response = await handleYouTubePlaylistRequest(dependencies);
	const responseText = await response.text();
	expect(response.status).toBe(502);
	expect(responseText).not.toContain(secretApiKey);
	expect(messages.join(" ")).not.toContain(secretApiKey);
});
