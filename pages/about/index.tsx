import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { GetStaticProps } from "next";
import React from "react";
import ArrowButton from "../../components/ArrowButton";
import PageLayout from "../../components/PageLayout";
import StyledImage from "../../components/StyledImage";
import WidthContainer from "../../components/WidthContainer";
import getAboutData from "../../utils/server/fetchers/about";
import getCommonData from "../../utils/server/fetchers/common";
import styles from "./About.module.scss";
import type { AboutData, PageProps } from "../../utils/types";

const About = ({
  headshot,
  bio,
  resume,
  commonData,
}: PageProps & AboutData) => {
  return (
    <PageLayout
      metadata={{
        title: "About Sarabeth",
        description:
          "Offering the very best private vocal lessons in Los Angeles. Refine your voice, achieve constant flow of breadth, and sing with ease.",
        keywords: ["vocal lessons los angeles", "piano teacher los angeles"],
      }}
      commonData={commonData}
    >
      <WidthContainer className={styles.container}>
        <div className={styles.headshot}>
          <StyledImage overlayDirection="right" image={headshot} priority />
        </div>
        <div className={styles.bio}>
          {documentToReactComponents(bio)}
          <ArrowButton url={resume} label="View Resume" />
        </div>
      </WidthContainer>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [commonData, aboutData] = await Promise.all([
    getCommonData(),
    getAboutData(),
  ]);
  return { props: { commonData, ...aboutData } };
};

export default About;
