import { client, formatImage, formatUrl } from "@/utils/contentful";
import type { AboutData } from "@/utils/types";

const getAboutData = async (): Promise<AboutData> => {
  // oxlint-disable-next-line typescript-eslint/no-explicit-any
  const aboutEntries: any = await client.getEntries({ content_type: "about" });
  const aboutResponse = aboutEntries?.items?.[0]?.fields;
  return {
    headshot: await formatImage(aboutResponse?.headshot),
    bio: aboutResponse?.bio,
    resume: formatUrl(aboutResponse?.resume?.fields?.file?.url),
    location: aboutResponse?.location,
  };
};

export default getAboutData;
