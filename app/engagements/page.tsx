import BannerImage from "@/components/BannerImage";
import EngagementsTable from "@/components/EngagementsTable";
import WidthContainer from "@/components/WidthContainer";
import getEngagementData from "@/utils/fetchers/engagements";
import { Engagement } from "@/utils/types";
import styles from "./Engagements.module.css";
import type { Metadata } from "next";

// Statically generated at build time, will error if any Dynamic APIs are used
export const dynamic = "error";

export const metadata: Metadata = {
  title: "Sarabeth's Engagements",
  description:
    "Young and talented female opera singer, Sarabeth Belon, captivates audiences throughout the country. Learn more about her current and upcoming engagements!",
  keywords: ["sarabeth belon engagements"],
  icons: "/favicon.png",
};

const isUpcoming = (dateString: string) => {
  const today = new Date();
  today.setUTCHours(24, 0, 0, 0);
  const endDate = new Date(dateString);
  endDate.setUTCHours(24, 0, 0, 0);
  return endDate >= today;
};

export default async function EngagementsPage() {
  const { engagements, bannerImage, title } = await getEngagementData();

  const upcoming = engagements
    .filter((engagement: Engagement) => isUpcoming(engagement.endDate))
    .sort((a: Engagement, b: Engagement) => {
      const dateA = new Date(a.endDate);
      const dateB = new Date(b.endDate);
      return dateA.getTime() - dateB.getTime();
    });

  const past = engagements
    .filter((engagement: Engagement) => !isUpcoming(engagement.endDate))
    .sort((a: Engagement, b: Engagement) => {
      const dateA = new Date(a.endDate);
      const dateB = new Date(b.endDate);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <>
      <BannerImage image={bannerImage} title={title} />
      <WidthContainer className={styles.container}>
        {upcoming.length > 0 && (
          <EngagementsTable engagements={upcoming} label="Upcoming" />
        )}
        {past.length > 0 && (
          <EngagementsTable engagements={past} label="Past" />
        )}
      </WidthContainer>
    </>
  );
}
