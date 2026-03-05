import { client, formatImage } from "@/utils/contentful";
import type { HomeData, ImageType } from "@/utils/types";
import type { Document } from "@contentful/rich-text-types";
import type {
  Asset as ContentfulAsset,
  EntrySkeletonType,
  EntryFieldTypes,
} from "contentful";

type HomeFields = {
  order: EntryFieldTypes.Number;
  mainSection: boolean;
  title: string;
  description: Document;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  images?: ContentfulAsset[];
};

type HomeSkeleton = EntrySkeletonType<HomeFields, "home">;

const getHomeData: () => Promise<HomeData[]> = async () => {
  const response = await client.getEntries<HomeSkeleton>({
    content_type: "home",
    order: ["fields.order"],
  });

  const formattedResponse = await Promise.all(
    response.items.map(async (entry) => {
      const rawImages = entry.fields.images as ContentfulAsset[] | undefined;
      let images: ImageType[] = [];
      if (rawImages) {
        images = await Promise.all(
          rawImages.map(async (img) => formatImage(img)),
        );
      }
      const homeSection: HomeData = {
        id: entry.sys.id,
        mainSection: Boolean(entry.fields.mainSection),
        title: String(entry.fields.title),
        description: entry.fields.description as Document,
        subtitle: entry.fields.subtitle
          ? String(entry.fields.subtitle)
          : undefined,
        buttonText: entry.fields.buttonText
          ? String(entry.fields.buttonText)
          : undefined,
        buttonLink: entry.fields.buttonLink
          ? String(entry.fields.buttonLink)
          : undefined,
        images,
      };
      return homeSection;
    }),
  );
  return formattedResponse;
};

export default getHomeData;
