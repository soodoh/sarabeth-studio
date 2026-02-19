import type { Audio, ImageType, SocialMediaLink } from "./";
import type { Document } from "@contentful/rich-text-types";

export type CommonData = {
  location: string;
  brandName: string;
  socialMediaLinks: SocialMediaLink[];
};
export type PageProps = {
  commonData: CommonData;
};

export type HomeData = {
  id: string;
  mainSection: boolean;
  title: string;
  description: Document;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  images: ImageType[];
};

export type AboutData = {
  headshot: ImageType;
  bio: Document;
  resume: string;
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

export enum LessonsPages {
  About = "About",
  Studio = "Studio",
  Resume = "Teaching Resume",
}
