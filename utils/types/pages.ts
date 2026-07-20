import type { Document } from "@contentful/rich-text-types";
import type { Audio, ImageType, SocialMediaLink } from "./common";

export type CommonData = {
	location: string;
	brandName: string;
	socialMediaLinks: SocialMediaLink[];
};

export type HomeData = {
	id: string;
	mainSection: boolean;
	title: string;
	description: Document;
	subtitle: string | undefined;
	buttonText: string | undefined;
	buttonLink: string | undefined;
	images: ImageType[];
};

export type AboutData = {
	headshot: ImageType;
	bio: Document;
	location: string;
};

export type Engagement = {
	id: string;
	title: string;
	role: string;
	company: string;
	link: string;
	startDate: string;
	endDate: string;
};

export type EngagementData = {
	title: string;
	bannerImage: ImageType;
	engagements: Engagement[];
};

export type LessonsData = {
	title: string;
	bannerImage: ImageType;
	followLink: string;
	aboutDescription: Document;
	teachingPhilosophy: Document;
	studioExpectations: Document;
	socialMediaDescription: Document;
	socialMediaImage: ImageType;
	teachingResume: Document;
	email: string;
	phoneNumber: string;
	reviewLink: string;
};

export type MediaData = {
	images: ImageType[];
	audio: Audio[];
};

export type ContactData = {
	bannerImage: ImageType;
};

export type ContentfulSnapshot = {
	common: CommonData;
	home: HomeData[];
	about: AboutData;
	engagements: EngagementData;
	lessons: LessonsData;
	media: MediaData;
	contact: ContactData;
};

export type PageProps = {
	commonData: CommonData;
};

export enum LessonsPages {
	About = "About",
	Studio = "Studio",
	Resume = "Teaching Resume",
}
