import type { YouTubePlaylist, YouTubePlaylistVideo } from "@/utils/types";

type UnknownRecord = Record<string, unknown>;

export type YouTubeThumbnail = {
	name: string;
	url: string;
	width?: number;
	height?: number;
};

export type YouTubePlaylistItem = {
	position: number;
	videoId?: string;
	title?: string;
	thumbnails: YouTubeThumbnail[];
	unavailable: boolean;
};

export type YouTubeVideoDetails = {
	id: string;
	duration: string;
	embeddable: boolean;
	madeForKids: boolean;
	privacyStatus: string;
};

const fail = (path: string, expectation: string): never => {
	throw new Error(`${path} must be ${expectation}`);
};

const isRecord = (value: unknown): value is UnknownRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const readRecord = (value: unknown, path: string): UnknownRecord => {
	if (!isRecord(value)) return fail(path, "an object");
	return value;
};

const readString = (value: unknown, path: string): string => {
	if (typeof value !== "string" || value.length === 0) {
		return fail(path, "a non-empty string");
	}
	return value;
};

const readOptionalString = (
	value: unknown,
	path: string,
): string | undefined =>
	value === undefined ? undefined : readString(value, path);

const readYouTubeVideoId = (value: unknown, path: string): string => {
	const id = readString(value, path);
	if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) {
		return fail(path, "a safe YouTube video ID");
	}
	return id;
};

const readOptionalYouTubeVideoId = (
	value: unknown,
	path: string,
): string | undefined =>
	value === undefined ? undefined : readYouTubeVideoId(value, path);

const readBoolean = (value: unknown, path: string): boolean => {
	if (typeof value !== "boolean") return fail(path, "a boolean");
	return value;
};

const readOptionalBoolean = (
	value: unknown,
	path: string,
): boolean | undefined =>
	value === undefined ? undefined : readBoolean(value, path);

const readNonNegativeInteger = (value: unknown, path: string): number => {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
		return fail(path, "a non-negative integer");
	}
	return value;
};

const readOptionalPositiveInteger = (
	value: unknown,
	path: string,
): number | undefined => {
	if (value === undefined) return undefined;
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
		return fail(path, "a positive integer");
	}
	return value;
};

const readArray = <T>(
	value: unknown,
	path: string,
	decode: (item: unknown, path: string, index: number) => T,
): T[] => {
	if (!Array.isArray(value)) return fail(path, "an array");
	return value.map((item, index) => decode(item, `${path}[${index}]`, index));
};

const readHttpsUrl = (value: unknown, path: string): string => {
	const source = readString(value, path);
	let url: URL;
	try {
		url = new URL(source);
	} catch {
		return fail(path, "an HTTPS URL");
	}
	if (url.protocol !== "https:" || !url.hostname) {
		return fail(path, "an HTTPS URL");
	}
	return source;
};

const readYouTubeThumbnailUrl = (value: unknown, path: string): string => {
	const source = readHttpsUrl(value, path);
	const hostname = new URL(source).hostname;
	if (hostname !== "ytimg.com" && !hostname.endsWith(".ytimg.com")) {
		return fail(path, "a YouTube thumbnail URL");
	}
	return source;
};

const readOptionalRecord = (
	value: unknown,
	path: string,
): UnknownRecord | undefined =>
	value === undefined ? undefined : readRecord(value, path);

const thumbnailNames = ["maxres", "standard", "high", "medium", "default"];

const decodeThumbnails = (value: unknown, path: string): YouTubeThumbnail[] => {
	const thumbnails = readOptionalRecord(value, path);
	if (!thumbnails) return [];

	const decoded: YouTubeThumbnail[] = [];
	for (const name of thumbnailNames) {
		const thumbnail = readOptionalRecord(thumbnails[name], `${path}.${name}`);
		if (!thumbnail) continue;
		decoded.push({
			name,
			url: readYouTubeThumbnailUrl(thumbnail.url, `${path}.${name}.url`),
			width: readOptionalPositiveInteger(
				thumbnail.width,
				`${path}.${name}.width`,
			),
			height: readOptionalPositiveInteger(
				thumbnail.height,
				`${path}.${name}.height`,
			),
		});
	}
	return decoded;
};

const isApproximatelySixteenByNine = ({
	width,
	height,
}: YouTubeThumbnail): boolean =>
	width !== undefined &&
	height !== undefined &&
	Math.abs(width / height - 16 / 9) < 0.02;

export const selectYouTubeThumbnail = (
	thumbnails: YouTubeThumbnail[],
): string | undefined => {
	const sixteenByNine = thumbnails.filter(isApproximatelySixteenByNine);
	return (
		sixteenByNine.find(({ name }) => name === "maxres")?.url ??
		sixteenByNine.find(({ name }) => name === "medium")?.url ??
		sixteenByNine[0]?.url ??
		thumbnails[0]?.url
	);
};

const unavailableTitle = /^(?:deleted|private) video$/i;

const decodePlaylistItem = (
	value: unknown,
	path: string,
	pageIndex: number,
): YouTubePlaylistItem => {
	if (!isRecord(value)) {
		return { position: pageIndex, thumbnails: [], unavailable: true };
	}

	try {
		const snippet = isRecord(value.snippet) ? value.snippet : undefined;
		const contentDetails = isRecord(value.contentDetails)
			? value.contentDetails
			: undefined;
		const resourceId = isRecord(snippet?.resourceId)
			? snippet.resourceId
			: undefined;
		const videoId =
			readOptionalYouTubeVideoId(
				contentDetails?.videoId,
				`${path}.contentDetails.videoId`,
			) ??
			readOptionalYouTubeVideoId(
				resourceId?.videoId,
				`${path}.snippet.resourceId.videoId`,
			);
		const title = readOptionalString(snippet?.title, `${path}.snippet.title`);
		const position =
			snippet?.position === undefined
				? pageIndex
				: readNonNegativeInteger(snippet.position, `${path}.snippet.position`);
		const thumbnails = decodeThumbnails(
			snippet?.thumbnails,
			`${path}.snippet.thumbnails`,
		);

		return {
			position,
			videoId,
			title,
			thumbnails,
			unavailable:
				!videoId ||
				!title ||
				unavailableTitle.test(title) ||
				selectYouTubeThumbnail(thumbnails) === undefined,
		};
	} catch {
		return { position: pageIndex, thumbnails: [], unavailable: true };
	}
};

export const decodeYouTubePlaylistMetadata = (
	value: unknown,
	expectedId: string,
): { id: string; title: string } => {
	const response = readRecord(value, "playlists.list");
	const items = readArray(
		response.items,
		"playlists.list.items",
		(item, path) => {
			const record = readRecord(item, path);
			const snippet = readRecord(record.snippet, `${path}.snippet`);
			return {
				id: readString(record.id, `${path}.id`),
				title: readString(snippet.title, `${path}.snippet.title`),
			};
		},
	);
	const playlist = items.find(({ id }) => id === expectedId);
	if (!playlist) return fail("playlists.list.items", "the configured playlist");
	return playlist;
};

export const decodeYouTubePlaylistItemsPage = (
	value: unknown,
): { items: YouTubePlaylistItem[]; nextPageToken?: string } => {
	const response = readRecord(value, "playlistItems.list");
	return {
		items: readArray(
			response.items,
			"playlistItems.list.items",
			decodePlaylistItem,
		),
		nextPageToken: readOptionalString(
			response.nextPageToken,
			"playlistItems.list.nextPageToken",
		),
	};
};

export const decodeYouTubeVideosPage = (
	value: unknown,
): YouTubeVideoDetails[] => {
	const response = readRecord(value, "videos.list");
	return readArray(response.items, "videos.list.items", (item, path) => {
		const record = readRecord(item, path);
		const contentDetails = readRecord(
			record.contentDetails,
			`${path}.contentDetails`,
		);
		const status = readRecord(record.status, `${path}.status`);
		return {
			id: readYouTubeVideoId(record.id, `${path}.id`),
			duration: readString(
				contentDetails.duration,
				`${path}.contentDetails.duration`,
			),
			embeddable: readBoolean(status.embeddable, `${path}.status.embeddable`),
			madeForKids:
				readOptionalBoolean(status.madeForKids, `${path}.status.madeForKids`) ??
				false,
			privacyStatus: readString(
				status.privacyStatus,
				`${path}.status.privacyStatus`,
			),
		};
	});
};

const durationPattern = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

export const formatYouTubeDuration = (duration: string): string => {
	const match = durationPattern.exec(duration);
	if (!match || match.slice(1).every((part) => part === undefined)) {
		return fail("duration", "an ISO-8601 duration");
	}
	const days = Number(match[1] ?? 0);
	const hours = Number(match[2] ?? 0);
	const minutes = Number(match[3] ?? 0);
	const seconds = Number(match[4] ?? 0);
	const totalSeconds = days * 86_400 + hours * 3_600 + minutes * 60 + seconds;
	if (!Number.isSafeInteger(totalSeconds)) {
		return fail("duration", "a supported ISO-8601 duration");
	}

	const totalHours = Math.floor(totalSeconds / 3_600);
	const remainingMinutes = Math.floor((totalSeconds % 3_600) / 60);
	const remainingSeconds = totalSeconds % 60;
	if (totalHours > 0) {
		return `${totalHours}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	}
	return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const decodeYouTubePlaylistVideo = (
	value: unknown,
	path: string,
): YouTubePlaylistVideo => {
	const video = readRecord(value, path);
	const id = readYouTubeVideoId(video.id, `${path}.id`);
	const watchUrl = readHttpsUrl(video.watchUrl, `${path}.watchUrl`);
	const parsedWatchUrl = new URL(watchUrl);
	if (
		parsedWatchUrl.hostname !== "www.youtube.com" ||
		parsedWatchUrl.pathname !== "/watch" ||
		parsedWatchUrl.searchParams.get("v") !== id
	) {
		return fail(`${path}.watchUrl`, "the matching YouTube watch URL");
	}
	return {
		id,
		title: readString(video.title, `${path}.title`),
		duration: readString(video.duration, `${path}.duration`),
		thumbnailUrl: readYouTubeThumbnailUrl(
			video.thumbnailUrl,
			`${path}.thumbnailUrl`,
		),
		embeddable: readBoolean(video.embeddable, `${path}.embeddable`),
		madeForKids: readBoolean(video.madeForKids, `${path}.madeForKids`),
		watchUrl,
	};
};

export const decodeYouTubePlaylist = (
	value: unknown,
	path = "youtubePlaylist",
): YouTubePlaylist => {
	const playlist = readRecord(value, path);
	return {
		id: readString(playlist.id, `${path}.id`),
		title: readString(playlist.title, `${path}.title`),
		unavailableCount: readNonNegativeInteger(
			playlist.unavailableCount,
			`${path}.unavailableCount`,
		),
		videos: readArray(
			playlist.videos,
			`${path}.videos`,
			decodeYouTubePlaylistVideo,
		),
	};
};
