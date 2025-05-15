import { client, formatImage } from "@/utils/server/contentful";
import type { HomeData, ImageType } from "@/utils/types";
import type { Document } from "@contentful/rich-text-types";

const getHomeData: () => Promise<HomeData[]> = async () => {
  const response = await client.getEntries({
    content_type: "home",
    order: ["fields.order"],
  });

  const formattedResponse = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.items.map(async (entry: any) => {
      let images: ImageType[] = [];
      if (Array.isArray(entry.fields?.images)) {
        images = await Promise.all(entry.fields?.images?.map(formatImage));
      }
      const response: HomeData = {
        id: entry.sys.id,
        mainSection: !!entry.fields.mainSection,
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
      return response;
    }),
  );
  return formattedResponse;
};

export default getHomeData;
