import { GetStaticProps } from "next";
import React from "react";
import ReactMarkdown from "react-markdown";
import PageLayout from "../../components/PageLayout";
import StyledImage from "../../components/StyledImage";
import getAboutData from "../../utils/fetchers/about";
import getCommonData from "../../utils/fetchers/common";
import styles from "./About.module.scss";
import type { AboutData } from "../../utils/fetchers/about";
import type { PageProps } from "../../utils/fetchers/common";

const About = ({ headshot, bio, title, commonData }: PageProps & AboutData) => {
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
      <div className={styles.container}>
        <div className={styles.headshot}>
          {headshot && <StyledImage type="right" image={headshot} />}
        </div>
        <div className={styles.bio}>
          <h1>{title}</h1>
          <ReactMarkdown>{bio}</ReactMarkdown>
        </div>
      </div>
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
