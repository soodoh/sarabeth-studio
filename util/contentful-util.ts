import { createClient, ContentfulClientApi, Entry } from "contentful";
import {
  Image,
  CommonData,
  SocialMediaLink,
  HomeData,
} from "./contentful-types";

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string;
let _client: ContentfulClientApi;

export function getClient() {
  if (!_client) {
    _client = createClient({
      space,
      accessToken,
    });
  }
  return _client;
}

export const formatImage = (image: any): Image => ({
  id: image?.sys?.id,
  url: `https:${image?.fields?.file?.url}`,
  title: image?.fields?.title,
  description: image?.fields?.description,
  width: image?.fields?.file?.details?.image?.width,
  height: image?.fields?.file?.details?.image?.height,
});

export const getCommonData: () => Promise<CommonData> = async () => {
  const aboutResponse: any = (
    await getClient().getEntries({ content_type: "about" })
  )?.items?.[0]?.fields;
  const socialResponse: any = (
    await getClient().getEntries({
      content_type: "socialMedia",
      order: "fields.order",
    })
  )?.items;
  const socialMediaLinks =
    socialResponse?.map(
      ({ fields }: any): SocialMediaLink => ({
        source: fields?.source || "",
        link: fields?.link || "",
      })
    ) || [];

  return {
    socialMediaLinks,
    location: aboutResponse?.location || "",
    brandName: aboutResponse?.title || "Sarabeth Belón",
  };
};

export const getHomeData: () => Promise<HomeData[]> = async () => {
  const response = await getClient().getEntries({
    content_type: "home",
    order: "fields.order",
  });
  const formattedResponse = response.items.map((entry: Entry<any>) => ({
    id: entry.sys.id,
    mainSection: !!entry.fields.mainSection,
    title: entry.fields.title || null,
    subtitle: entry.fields.subtitle || null,
    description: entry.fields.description,
    buttonText: entry.fields.buttonText || null,
    buttonLink: entry.fields.buttonLink || null,
    images: entry.fields?.images?.map(formatImage),
  }));
  return formattedResponse;
};

export const getAboutData = async () => {
  const response = await getClient().getEntries({
    content_type: "about",
  });
};

export const getEngagementsData = async () => {};

export const getMediaData = async () => {};

export const getLessonsData = async () => {};

export const getContactData = async () => {};
