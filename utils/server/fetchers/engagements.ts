import { formatImage, getClient } from "../contentful";
import type { Image } from "../contentful";

export type EngagementData = {
  title: string;
  bannerImage: Image;
  engagements: Engagement[];
};

export type Engagement = {
  id: string;
  title: string;
  role: string;
  company: string;
  link: string;
  startDate: string;
  endDate: string;
};

const getEngagementsData = async (): Promise<EngagementData> => {
  const client = getClient();
  const [pageResponse, engagementsResponse]: any[] = await Promise.all([
    client.getEntries({ content_type: "engagementsPage" }),
    client.getEntries({ content_type: "engagements" }),
  ]);
  const engagements: Engagement[] = engagementsResponse?.items.map(
    (engagement: any) => ({
      id: engagement?.sys?.id,
      title: engagement?.fields?.label,
      role: engagement?.fields?.role,
      company: engagement?.fields?.company,
      link: engagement?.fields?.link,
      startDate: engagement?.fields?.startDate,
      endDate: engagement?.fields?.endDate,
    })
  );
  const engagementData = {
    title: pageResponse?.items?.[0]?.fields?.title || "",
    bannerImage: await formatImage(pageResponse?.items?.[0]?.fields?.banner),
    engagements,
  };
  return engagementData;
};

export default getEngagementsData;
