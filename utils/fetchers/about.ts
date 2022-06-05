import { type Image, formatImage, formatUrl, getClient } from "../contentful";

export interface AboutData {
  title: string;
  headshot?: Image;
  bio: string;
  resume: string;
  location: string;
}

const getAboutData = async (): Promise<AboutData> => {
  const aboutResponse: any = (
    await getClient().getEntries({ content_type: "about" })
  )?.items?.[0]?.fields;
  return {
    title: aboutResponse?.title || "Sarabeth Belón",
    headshot: formatImage(aboutResponse?.headshot),
    bio: aboutResponse?.bio || "Description",
    resume: formatUrl(aboutResponse?.resume?.fields?.file?.url),
    location: aboutResponse?.location || "California",
  };
};

export default getAboutData;
