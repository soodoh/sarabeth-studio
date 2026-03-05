import { client, formatImage, formatUrl } from "@/utils/contentful";
import type { AboutData } from "@/utils/types";
import type { Document } from "@contentful/rich-text-types";
import type {
  Asset as ContentfulAsset,
  AssetFields,
  EntrySkeletonType,
} from "contentful";

type AboutFields = {
  headshot: ContentfulAsset;
  bio: Document;
  resume: ContentfulAsset;
  location: string;
};

type AboutSkeleton = EntrySkeletonType<AboutFields, "about">;

const getAboutData = async (): Promise<AboutData> => {
  const aboutEntries = await client.getEntries<AboutSkeleton>({
    content_type: "about",
  });
  const aboutResponse = aboutEntries.items[0]?.fields;
  return {
    headshot: await formatImage(aboutResponse?.headshot as ContentfulAsset),
    bio: aboutResponse?.bio as Document,
    resume: formatUrl(
      String(
        ((aboutResponse?.resume as ContentfulAsset)?.fields as AssetFields)
          ?.file?.url ?? "",
      ),
    ),
    location: String(aboutResponse?.location ?? ""),
  };
};

export default getAboutData;
