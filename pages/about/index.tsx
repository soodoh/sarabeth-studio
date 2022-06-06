import { GetStaticProps } from "next";
import React from "react";
import ReactMarkdown from "react-markdown";
import PageLayout from "../../components/PageLayout";
import StyledImage from "../../components/StyledImage";
import getAboutData from "../../utils/fetchers/about";
import type { AboutData } from "../../utils/fetchers/about";
import getCommonData from "../../utils/fetchers/common";
import type { PageProps } from "../../utils/fetchers/common";
import styles from "./styles.module.scss";

interface Props extends PageProps, AboutData {}

const About = (props: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "About Sarabeth",
        description:
          "Offering the very best private vocal lessons in Los Angeles. Refine your voice, achieve constant flow of breadth, and sing with ease.",
        keywords: ["vocal lessons los angeles", "piano teacher los angeles"],
      }}
      commonData={props.commonData}
    >
      <div className={styles.container}>
        <div className={styles.headshot}>
          {props.headshot && (
            <StyledImage type="right" image={props.headshot} />
          )}
        </div>
        <div className={styles.bio}>
          <h1>{props.title}</h1>
          <ReactMarkdown>{props.bio}</ReactMarkdown>
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
