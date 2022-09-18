import { GetStaticProps } from "next";
import React from "react";
import ReactMarkdown from "react-markdown";
import ArrowButton from "../../components/ArrowButton";
import PageLayout from "../../components/PageLayout";
import StyledImage from "../../components/StyledImage";
import WidthContainer from "../../components/WidthContainer";
import getAboutData from "../../utils/fetchers/about";
import getCommonData from "../../utils/fetchers/common";
import styles from "./About.module.scss";
import type { AboutData } from "../../utils/fetchers/about";
import type { PageProps } from "../../utils/fetchers/common";

const About = ({
  headshot,
  bio,
  title,
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
          {headshot && (
            <StyledImage overlayDirection="right" image={headshot} />
          )}
        </div>
        <div className={styles.bio}>
          <ReactMarkdown>{bio}</ReactMarkdown>
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
