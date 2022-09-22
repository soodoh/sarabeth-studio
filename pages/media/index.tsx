import { GetStaticProps } from "next";
import React from "react";
import PageLayout from "../../components/PageLayout";
import WidthContainer from "../../components/WidthContainer";
import getCommonData from "../../utils/server/fetchers/common";
import getMediaData from "../../utils/server/fetchers/media";
import styles from "./Media.module.scss";
import type { PageProps } from "../../utils/server/fetchers/common";
import type { MediaData } from "../../utils/server/fetchers/media";

const Media = ({ commonData }: PageProps & MediaData) => {
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
      <WidthContainer className={styles.container}>
        <h1>Coming Soon!</h1>
      </WidthContainer>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [commonData, mediaData] = await Promise.all([
    getCommonData(),
    getMediaData(),
  ]);
  return { props: { commonData, ...mediaData } };
};

export default Media;
