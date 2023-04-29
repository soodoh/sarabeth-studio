import type { Audio, Image, SocialMediaLink } from "./";
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
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  images: Image[];
};

export type AboutData = {
  headshot: Image;
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
  bannerImage: Image;
  engagements: Engagement[];
};

export type LessonsData = {
  title: string;
  bannerImage: Image;
  followLink: string;
  aboutDescription: Document;
  teachingPhilosophy: Document;
  studioExpectations: Document;
  socialMediaDescription: Document;
  socialMediaImage: Image;
  teachingResume: Document;
  email: string;
  phoneNumber: string;
  reviewLink: string;
};

export type MediaData = {
  images: Image[];
  audio: Audio[];
};

export type ContactData = {
  bannerImage: Image;
};
