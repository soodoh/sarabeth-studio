import type { EntryFieldTypes, EntrySkeletonType } from "contentful";
import { client } from "@/utils/contentful";
import type {
  CommonData,
  SocialMediaLink,
  SocialMediaType,
} from "@/utils/types";

type AboutFields = {
  title: string;
  location: string;
};

type SocialMediaFields = {
  order: EntryFieldTypes.Number;
  source: SocialMediaType;
  link: string;
};

type AboutSkeleton = EntrySkeletonType<AboutFields, "about">;
type SocialMediaSkeleton = EntrySkeletonType<SocialMediaFields, "socialMedia">;

const getCommonData = async (): Promise<CommonData> => {
  const [aboutResponse, socialResponse] = await Promise.all([
    client.getEntries<AboutSkeleton>({ content_type: "about" }),
    client.getEntries<SocialMediaSkeleton>({
      content_type: "socialMedia",
      order: ["fields.order"],
    }),
  ]);
  const socialMediaLinks: SocialMediaLink[] = socialResponse.items.map(
    ({ fields }): SocialMediaLink => ({
      source: (fields.source as SocialMediaType) ?? "",
      link: String(fields.link ?? ""),
    }),
  );

  return {
    socialMediaLinks,
    location: String(aboutResponse.items[0]?.fields?.location ?? ""),
    brandName: String(
      aboutResponse.items[0]?.fields?.title ?? "Sarabeth Belón",
    ),
  };
};

export default getCommonData;
