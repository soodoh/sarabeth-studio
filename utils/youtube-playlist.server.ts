import {
	GetParameterCommand,
	type GetParameterCommandOutput,
	SSMClient,
	type SSMClientConfig,
} from "@aws-sdk/client-ssm";
import type { YouTubePlaylist } from "@/utils/types";
import {
	youtubeApiKeyParameterName,
	youtubePlaylistId,
} from "@/utils/youtube-playlist-config";
import {
	decodeYouTubePlaylistItemsPage,
	decodeYouTubePlaylistMetadata,
	decodeYouTubeVideosPage,
	formatYouTubeDuration,
	selectYouTubeThumbnail,
	type YouTubePlaylistItem,
} from "@/utils/youtube-playlist-data";

const youtubeApiBaseUrl = "https://www.googleapis.com/youtube/v3";
const defaultTimeoutMilliseconds = 8_000;

export const youtubePlaylistSuccessCacheControl =
	"public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";
export const youtubePlaylistErrorCacheControl = "no-store";

export class YouTubePlaylistConfigurationError extends Error {}
export class YouTubePlaylistUpstreamError extends Error {}

export interface YouTubeSsmClient {
	send(command: GetParameterCommand): Promise<GetParameterCommandOutput>;
}

export interface YouTubeServerEnvironment {
	YOUTUBE_API_KEY_PARAMETER?: string;
	YOUTUBE_API_KEY?: string;
}

type SsmClientFactory = (configuration: SSMClientConfig) => YouTubeSsmClient;

const createSsmClient: SsmClientFactory = (configuration) => {
	const client = new SSMClient(configuration);
	return {
		send: (command) => client.send(command),
	};
};

export const createYouTubeApiKeyReader = ({
	environment = process.env,
	clientFactory = createSsmClient,
}: {
	environment?: YouTubeServerEnvironment;
	clientFactory?: SsmClientFactory;
} = {}): (() => Promise<string>) => {
	return async () => {
		const configuredParameterName =
			environment.YOUTUBE_API_KEY_PARAMETER?.trim();
		if (!configuredParameterName) {
			const localApiKey = environment.YOUTUBE_API_KEY?.trim();
			if (localApiKey) return localApiKey;
		}

		const parameterName = configuredParameterName || youtubeApiKeyParameterName;
		if (parameterName !== youtubeApiKeyParameterName) {
			throw new YouTubePlaylistConfigurationError(
				"The YouTube API key parameter is not configured correctly",
			);
		}
		try {
			const client = clientFactory({ region: "us-west-2" });
			const response = await client.send(
				new GetParameterCommand({
					Name: parameterName,
					WithDecryption: true,
				}),
			);
			if (response.Parameter?.Type !== "SecureString") {
				throw new YouTubePlaylistConfigurationError(
					"The YouTube API key parameter must be a SecureString",
				);
			}
			const value = response.Parameter.Value?.trim();
			if (!value) {
				throw new YouTubePlaylistConfigurationError(
					"The YouTube API key parameter is empty",
				);
			}
			return value;
		} catch (error) {
			if (error instanceof YouTubePlaylistConfigurationError) throw error;
			throw new YouTubePlaylistConfigurationError(
				"Unable to read the YouTube API key parameter",
			);
		}
	};
};

export interface YouTubePlaylistLogger {
	error(message: string): void;
}

export interface YouTubePlaylistDependencies {
	readApiKey(): Promise<string>;
	fetch(input: string | URL | Request, init?: RequestInit): Promise<Response>;
	timeoutMilliseconds: number;
	logger: YouTubePlaylistLogger;
}

const productionYouTubePlaylistDependencies: YouTubePlaylistDependencies = {
	readApiKey: createYouTubeApiKeyReader(),
	fetch: (input, init) => fetch(input, init),
	timeoutMilliseconds: defaultTimeoutMilliseconds,
	logger: console,
};

const fetchYouTubeJson = async (
	path: string,
	parameters: URLSearchParams,
	dependencies: YouTubePlaylistDependencies,
): Promise<unknown> => {
	const controller = new AbortController();
	const timeout = setTimeout(
		() => controller.abort(),
		dependencies.timeoutMilliseconds,
	);
	try {
		const apiKey = parameters.get("key");
		if (!apiKey) {
			throw new YouTubePlaylistConfigurationError(
				"The YouTube API key is unavailable",
			);
		}
		parameters.delete("key");
		const response = await dependencies.fetch(
			`${youtubeApiBaseUrl}/${path}?${parameters}`,
			{
				headers: {
					Accept: "application/json",
					"X-Goog-Api-Key": apiKey,
				},
				signal: controller.signal,
			},
		);
		if (!response.ok) {
			throw new YouTubePlaylistUpstreamError(
				"The YouTube Data API returned an unsuccessful response",
			);
		}
		const body: unknown = await response.json();
		return body;
	} catch (error) {
		if (error instanceof YouTubePlaylistUpstreamError) throw error;
		throw new YouTubePlaylistUpstreamError(
			controller.signal.aborted
				? "The YouTube Data API request timed out"
				: "The YouTube Data API request failed",
		);
	} finally {
		clearTimeout(timeout);
	}
};

const createBaseParameters = (apiKey: string): URLSearchParams =>
	new URLSearchParams({ key: apiKey });

const fetchPlaylistMetadata = async (
	apiKey: string,
	dependencies: YouTubePlaylistDependencies,
): Promise<{ id: string; title: string }> => {
	const parameters = createBaseParameters(apiKey);
	parameters.set("part", "snippet");
	parameters.set("id", youtubePlaylistId);
	parameters.set("fields", "items(id,snippet/title)");
	return decodeYouTubePlaylistMetadata(
		await fetchYouTubeJson("playlists", parameters, dependencies),
		youtubePlaylistId,
	);
};

const fetchPlaylistItems = async (
	apiKey: string,
	dependencies: YouTubePlaylistDependencies,
): Promise<YouTubePlaylistItem[]> => {
	const items: YouTubePlaylistItem[] = [];
	const visitedPageTokens = new Set<string>();
	let nextPageToken: string | undefined;

	do {
		const parameters = createBaseParameters(apiKey);
		parameters.set("part", "snippet,contentDetails");
		parameters.set("playlistId", youtubePlaylistId);
		parameters.set("maxResults", "50");
		parameters.set(
			"fields",
			"nextPageToken,items(contentDetails/videoId,snippet(position,resourceId/videoId,thumbnails,title))",
		);
		if (nextPageToken) parameters.set("pageToken", nextPageToken);
		const page = decodeYouTubePlaylistItemsPage(
			await fetchYouTubeJson("playlistItems", parameters, dependencies),
		);
		items.push(...page.items);
		nextPageToken = page.nextPageToken;
		if (nextPageToken) {
			if (visitedPageTokens.has(nextPageToken)) {
				throw new YouTubePlaylistUpstreamError(
					"The YouTube Data API repeated a playlist page token",
				);
			}
			visitedPageTokens.add(nextPageToken);
		}
	} while (nextPageToken);

	return items.toSorted((left, right) => left.position - right.position);
};

const chunkVideoIds = (videoIds: string[]): string[][] => {
	const batches: string[][] = [];
	for (let index = 0; index < videoIds.length; index += 50) {
		batches.push(videoIds.slice(index, index + 50));
	}
	return batches;
};

const fetchVideoDetails = async (
	apiKey: string,
	videoIds: string[],
	dependencies: YouTubePlaylistDependencies,
) => {
	const uniqueVideoIds = [...new Set(videoIds)];
	const batches = chunkVideoIds(uniqueVideoIds);
	const pages = await Promise.all(
		batches.map(async (batch) => {
			const parameters = createBaseParameters(apiKey);
			parameters.set("part", "contentDetails,status");
			parameters.set("id", batch.join(","));
			parameters.set("maxResults", "50");
			parameters.set(
				"fields",
				"items(id,contentDetails/duration,status(embeddable,madeForKids,privacyStatus))",
			);
			return decodeYouTubeVideosPage(
				await fetchYouTubeJson("videos", parameters, dependencies),
			);
		}),
	);
	return new Map(pages.flat().map((video) => [video.id, video]));
};

const createWatchUrl = (videoId: string): string => {
	const url = new URL("https://www.youtube.com/watch");
	url.searchParams.set("v", videoId);
	return url.toString();
};

export const fetchYouTubePlaylist = async (
	dependencies: YouTubePlaylistDependencies = productionYouTubePlaylistDependencies,
): Promise<YouTubePlaylist> => {
	const apiKey = await dependencies.readApiKey();
	let metadata: { id: string; title: string };
	let playlistItems: YouTubePlaylistItem[];
	try {
		[metadata, playlistItems] = await Promise.all([
			fetchPlaylistMetadata(apiKey, dependencies),
			fetchPlaylistItems(apiKey, dependencies),
		]);
	} catch (error) {
		if (error instanceof YouTubePlaylistUpstreamError) throw error;
		throw new YouTubePlaylistUpstreamError(
			"The YouTube Data API returned invalid data",
		);
	}

	const availableVideoIds = playlistItems.flatMap((item) =>
		item.unavailable || !item.videoId ? [] : [item.videoId],
	);
	let videoDetails: Awaited<ReturnType<typeof fetchVideoDetails>>;
	try {
		videoDetails = await fetchVideoDetails(
			apiKey,
			availableVideoIds,
			dependencies,
		);
	} catch (error) {
		if (error instanceof YouTubePlaylistUpstreamError) throw error;
		throw new YouTubePlaylistUpstreamError(
			"The YouTube Data API returned invalid data",
		);
	}

	let unavailableCount = 0;
	const videos: YouTubePlaylist["videos"] = [];
	for (const item of playlistItems) {
		const details = item.videoId ? videoDetails.get(item.videoId) : undefined;
		const thumbnailUrl = selectYouTubeThumbnail(item.thumbnails);
		if (
			item.unavailable ||
			!item.videoId ||
			!item.title ||
			!thumbnailUrl ||
			!details ||
			details.privacyStatus === "private"
		) {
			unavailableCount += 1;
			continue;
		}

		let duration: string;
		try {
			duration = formatYouTubeDuration(details.duration);
		} catch {
			unavailableCount += 1;
			continue;
		}
		videos.push({
			id: item.videoId,
			title: item.title,
			duration,
			thumbnailUrl,
			embeddable: details.embeddable,
			madeForKids: details.madeForKids,
			watchUrl: createWatchUrl(item.videoId),
		});
	}

	return {
		id: metadata.id,
		title: metadata.title,
		unavailableCount,
		videos,
	};
};

export const handleYouTubePlaylistRequest = async (
	dependencies: YouTubePlaylistDependencies = productionYouTubePlaylistDependencies,
): Promise<Response> => {
	try {
		return Response.json(await fetchYouTubePlaylist(dependencies), {
			status: 200,
			headers: { "Cache-Control": youtubePlaylistSuccessCacheControl },
		});
	} catch (error) {
		if (error instanceof YouTubePlaylistConfigurationError) {
			dependencies.logger.error(
				"YouTube playlist configuration is unavailable",
			);
			return Response.json(
				{ error: "YouTube playlist is unavailable" },
				{
					status: 500,
					headers: { "Cache-Control": youtubePlaylistErrorCacheControl },
				},
			);
		}
		dependencies.logger.error("YouTube playlist upstream request failed");
		return Response.json(
			{ error: "YouTube playlist is temporarily unavailable" },
			{
				status: 502,
				headers: { "Cache-Control": youtubePlaylistErrorCacheControl },
			},
		);
	}
};
