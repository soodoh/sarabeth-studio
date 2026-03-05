import { client, formatImage } from "@/utils/contentful";
import type { Engagement, EngagementData } from "@/utils/types";
import type { Asset as ContentfulAsset, EntrySkeletonType } from "contentful";

type EngagementsPageFields = {
  title: string;
  banner: ContentfulAsset;
};

type EngagementFields = {
  label: string;
  role: string;
  company: string;
  link: string;
  startDate: string;
  endDate: string;
};

type EngagementsPageSkeleton = EntrySkeletonType<
  EngagementsPageFields,
  "engagementsPage"
>;
type EngagementSkeleton = EntrySkeletonType<EngagementFields, "engagements">;

const getEngagementsData = async (): Promise<EngagementData> => {
  const [pageResponse, engagementsResponse] = await Promise.all([
    client.getEntries<EngagementsPageSkeleton>({
      content_type: "engagementsPage",
    }),
    client.getEntries<EngagementSkeleton>({ content_type: "engagements" }),
  ]);
  const engagements: Engagement[] = engagementsResponse.items.map(
    (engagement) => ({
      id: engagement.sys.id,
      title: String(engagement.fields.label ?? ""),
      role: String(engagement.fields.role ?? ""),
      company: String(engagement.fields.company ?? ""),
      link: String(engagement.fields.link ?? ""),
      startDate: String(engagement.fields.startDate ?? ""),
      endDate: String(engagement.fields.endDate ?? ""),
    }),
  );
  const engagementData: EngagementData = {
    title: String(pageResponse.items[0]?.fields?.title ?? ""),
    bannerImage: await formatImage(
      pageResponse.items[0]?.fields?.banner as ContentfulAsset,
    ),
    engagements,
  };
  return engagementData;
};

export default getEngagementsData;
