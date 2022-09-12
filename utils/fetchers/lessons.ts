import { formatImage, getClient } from "../contentful";
import type { Image } from "../contentful";

export type LessonsData = {
  title: string;
  bannerImage: Image;
  followLink: string;
  infoDescription: string;
  ratesDescription: string;
  socialMediaDescription: string;
  socialMediaImage: Image;
  email: string;
  phoneNumber: string;
  reviewLink: string;
};

const getLessonsData = async (): Promise<LessonsData> => {
  const client = getClient();
  const pageResponse: any = await client.getEntries({
    content_type: "lessons",
  });
  const lessonsData = {
    title: pageResponse?.items?.[0]?.fields?.title || "",
    bannerImage: formatImage(pageResponse?.items?.[0]?.fields?.bannerImage),
    infoDescription: pageResponse?.items?.[0]?.fields?.infoDescription || "",
    ratesDescription: pageResponse?.items?.[0]?.fields?.ratesDescription || "",
    socialMediaDescription:
      pageResponse?.items?.[0]?.fields?.socialMediaDescription || "",
    socialMediaImage: formatImage(
      pageResponse?.items?.[0]?.fields?.socialMediaImage
    ),
    teachingResume: pageResponse?.items?.[0]?.fields?.teachingResume || "",
    reviewLink: pageResponse?.items?.[0]?.fields?.reviewLink,
    phoneNumber: pageResponse?.items?.[0]?.fields?.phoneNumber,
    email: pageResponse?.items?.[0]?.fields?.email,
    followLink: pageResponse?.items?.[0]?.fields?.followLink,
  };
  return lessonsData;
};

export default getLessonsData;
