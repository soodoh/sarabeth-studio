import { formatImage, getClient } from "../contentful";
import type { Image } from "../contentful";

export type LessonsData = {
  title: string;
  bannerImage: Image;
  followLink: string;
  aboutDescription: string;
  teachingPhilosophy: string;
  studioExpectations: string;
  socialMediaDescription: string;
  socialMediaImage: Image;
  teachingResume: string;
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
    title: lessonsResponse?.title || "",
    bannerImage: formatImage(lessonsResponse?.bannerImage),
    aboutDescription: lessonsResponse?.aboutDescription || "",
    teachingPhilosophy: lessonsResponse?.teachingPhilosophy || "",
    studioExpectations: lessonsResponse?.studioExpectations || "",
    socialMediaDescription: lessonsResponse?.socialMediaDescription || "",
    socialMediaImage: formatImage(lessonsResponse?.socialMediaImage),
    teachingResume: lessonsResponse?.teachingResume || "",
    reviewLink: lessonsResponse?.reviewLink,
    phoneNumber: lessonsResponse?.phoneNumber,
    email: lessonsResponse?.email,
    followLink: lessonsResponse?.followLink,
  };
  return lessonsData;
};

export default getLessonsData;
