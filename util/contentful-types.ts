import { Document } from "@contentful/rich-text-types";

export interface PageProps {
  commonData: CommonData;
}

export interface Image {
  id: string;
  url: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

export interface SocialMediaLink {
  source: string;
  link: string;
}

export interface CommonData {
  location: string;
  brandName: string;
  socialMediaLinks: SocialMediaLink[];
}

export interface HomeData {
  id: string;
  mainSection: boolean;
  title: string;
  description: Document;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  images: Image[];
}

export interface AboutData {
  title: string;
  headshot?: Image;
  bio: string;
  resume: string;
  location: string;
}
