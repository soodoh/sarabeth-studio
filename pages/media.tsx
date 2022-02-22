import React from "react";
import type { GetStaticProps } from "next";
import PageLayout from "../components/PageLayout";
import { getCommonData } from "../util/contentful-util";
import { PageProps } from "../util/contentful-types";

interface Props extends PageProps {}

const Media = (props: Props) => {
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
      commonData={props.commonData}
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
