export type Asset = {
	id: string;
	title: string;
	description: string;
	url: string;
};

export type ImageType = Asset & {
	width: number;
	height: number;
	placeholder: string;
	dominantColor?: string;
};

export type Audio = Asset;

export type YouTubePlaylistVideo = {
	id: string;
	title: string;
	duration: string;
	thumbnailUrl: string;
	embeddable: boolean;
	madeForKids: boolean;
	watchUrl: string;
};

export type YouTubePlaylist = {
	id: string;
	title: string;
	unavailableCount: number;
	videos: YouTubePlaylistVideo[];
};

export type SocialMediaType =
	| "facebook"
	| "instagram"
	| "linkedin"
	| "twitter"
	| "youtube"
	| "email";

export type SocialMediaLink = {
	source: SocialMediaType;
	link: string;
};

export type EmailData = {
	name: string;
	email: string;
	subject: string;
	message: string;
};
