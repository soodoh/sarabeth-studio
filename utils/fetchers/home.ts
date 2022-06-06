import { Document } from "@contentful/rich-text-types";
import { Entry } from "contentful";

import { formatImage, getClient } from "../contentful";

import type { Image } from "../contentful";

export type HomeData = {
  id: string;
  mainSection: boolean;
  title: string;
  description: Document;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  images: Image[];
};

const getHomeData: () => Promise<HomeData[]> = async () => {
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

export default getHomeData;
