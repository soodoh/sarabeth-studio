import { client, formatImage } from "@/utils/contentful";
import type { Engagement, EngagementData } from "@/utils/types";

const getEngagementsData = async (): Promise<EngagementData> => {
  // oxlint-disable-next-line typescript-eslint/no-explicit-any
  const [pageResponse, engagementsResponse]: any[] = await Promise.all([
    client.getEntries({ content_type: "engagementsPage" }),
    client.getEntries({ content_type: "engagements" }),
  ]);
  const engagements: Engagement[] = engagementsResponse?.items.map(
    // oxlint-disable-next-line typescript-eslint/no-explicit-any
    (engagement: any) => ({
      id: engagement?.sys?.id,
      title: engagement?.fields?.label,
      role: engagement?.fields?.role,
      company: engagement?.fields?.company,
      link: engagement?.fields?.link,
      startDate: engagement?.fields?.startDate,
      endDate: engagement?.fields?.endDate,
    }),
  );
  const engagementData = {
    title: pageResponse?.items?.[0]?.fields?.title || "",
    bannerImage: await formatImage(pageResponse?.items?.[0]?.fields?.banner),
    engagements,
  };
  return engagementData;
};

export default getEngagementsData;
