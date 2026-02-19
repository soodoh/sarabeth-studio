import { client, formatImage } from "@/utils/contentful";
import type { HomeData, ImageType } from "@/utils/types";
import type { Document } from "@contentful/rich-text-types";

const getHomeData: () => Promise<HomeData[]> = async () => {
  const response = await client.getEntries({
    content_type: "home",
    order: ["fields.order"],
  });

  const formattedResponse = await Promise.all(
    // oxlint-disable-next-line typescript-eslint/no-explicit-any
    response.items.map(async (entry: any) => {
      let images: ImageType[] = [];
      if (Array.isArray(entry.fields?.images)) {
        images = await Promise.all(entry.fields?.images?.map(formatImage));
      }
      const homeSection: HomeData = {
        id: entry.sys.id,
        mainSection: Boolean(entry.fields.mainSection),
        title: String(entry.fields.title),
        description: entry.fields.description as Document,
        subtitle: entry.fields.subtitle ? String(entry.fields.subtitle) : null,
        buttonText: entry.fields.buttonText
          ? String(entry.fields.buttonText)
          : null,
        buttonLink: entry.fields.buttonLink
          ? String(entry.fields.buttonLink)
          : null,
        images,
      };
      return homeSection;
    }),
  );
  return formattedResponse;
};

export default getHomeData;
