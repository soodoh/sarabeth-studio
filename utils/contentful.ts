import { ContentfulClientApi, createClient } from "contentful";

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

export const formatUrl = (url?: string) => `https:${url}`;

export interface Image {
  id: string;
  url: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

export const formatImage = (image: any): Image => ({
  id: image?.sys?.id,
  url: formatUrl(image?.fields?.file?.url),
  title: image?.fields?.title,
  description: image?.fields?.description || "Alt text",
  width: image?.fields?.file?.details?.image?.width,
  height: image?.fields?.file?.details?.image?.height,
});
