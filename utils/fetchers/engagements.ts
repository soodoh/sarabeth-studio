import { formatImage, getClient } from "../contentful";
import type { Image } from "../contentful";

export type EngagementData = {
  title: string;
  banner: Image;
  engagements: Engagement[];
};

export type Engagement = {
  title: string;
  role: string;
  company: string;
  link: string;
  startDate: Date;
  endDate: Date;
};

const getEngagementsData = async (): Promise<EngagementData> => {
  const client = getClient();
  const [pageResponse, engagementsResponse]: any[] = await Promise.all([
    client.getEntries({ content_type: "engagementsPage" }),
    client.getEntries({ content_type: "engagements" }),
  ]);
  const engagements: Engagement[] = engagementsResponse?.items.map(
    (engagement: any) => ({
      title: engagement?.fields?.label,
      role: engagement?.fields?.role,
      company: engagement?.fields?.company,
      link: engagement?.fields?.link,
      startDate: new Date(engagement?.fields?.startDate),
      endDate: new Date(engagement?.fields?.endDate),
    })
  );
  const engagementData = {
    title: pageResponse?.items?.[0]?.fields?.title || "",
    banner: formatImage(pageResponse?.items?.[0]?.fields?.banner),
    engagements,
  };
  return engagementData;
};

export default getEngagementsData;
