import { GetStaticProps } from "next";
import React from "react";
import PageLayout from "../../components/PageLayout";
import getCommonData from "../../utils/fetchers/common";
import type { PageProps } from "../../utils/fetchers/common";

const Media = ({ commonData }: PageProps) => {
  return (
    <PageLayout
      metadata={{
        title: "Sarabeth's Recordings & Photos",
        description:
          "Sarabeth Belón's media page: recordings, photos and videos. Listen to recordings of her opera arias and art songs. Clips of her performances are also available. View pictures from past performances, professional headshots and more. Photo credits included when viewing higher resolution images.",
        keywords: [
          "sarabeth belon media",
          "sarabeth belon recordings",
          "sarabeth belon photos",
        ],
      }}
      commonData={commonData}
    >
      some stuff
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await getCommonData();
  return { props: { commonData } };
};

export default Media;
