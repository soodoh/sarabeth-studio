import { formatImage, formatUrl, getClient } from "../contentful";
import type { Image } from "../contentful";
import type { Document } from "@contentful/rich-text-types";

export type AboutData = {
  headshot: Image;
  bio: Document;
  resume: string;
  location: string;
};

const getAboutData = async (): Promise<AboutData> => {
  const aboutResponse: any = (
    await getClient().getEntries({ content_type: "about" })
  )?.items?.[0]?.fields;
  return {
    headshot: await formatImage(aboutResponse?.headshot),
    bio: aboutResponse?.bio,
    resume: formatUrl(aboutResponse?.resume?.fields?.file?.url),
    location: aboutResponse?.location,
  };
};

export default getAboutData;
