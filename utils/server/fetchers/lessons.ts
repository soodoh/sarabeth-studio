import { formatImage, getClient } from "../contentful";
import type { Image } from "../contentful";
import type { Document } from "@contentful/rich-text-types";

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

const getLessonsData = async (): Promise<LessonsData> => {
  const client = getClient();
  const lessonsResponse: any = (
    await client.getEntries({
      content_type: "lessons",
    })
  )?.items?.[0]?.fields;
  const lessonsData = {
    title: lessonsResponse?.title,
    bannerImage: await formatImage(lessonsResponse?.bannerImage),
    aboutDescription: lessonsResponse?.aboutDescription,
    teachingPhilosophy: lessonsResponse?.teachingPhilosophy,
    studioExpectations: lessonsResponse?.studioExpectations,
    socialMediaDescription: lessonsResponse?.socialMediaDescription,
    socialMediaImage: await formatImage(lessonsResponse?.socialMediaImage),
    teachingResume: lessonsResponse?.teachingResume,
    reviewLink: lessonsResponse?.reviewLink,
    phoneNumber: lessonsResponse?.phoneNumber,
    email: lessonsResponse?.email,
    followLink: lessonsResponse?.followLink,
  };
  return lessonsData;
};

export default getLessonsData;
