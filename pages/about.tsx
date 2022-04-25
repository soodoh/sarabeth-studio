import React from "react";
import { GetStaticProps } from "next";
import PageLayout from "../components/PageLayout";
import { getCommonData, getAboutData } from "../util/contentful-util";
import { AboutData, PageProps } from "../util/contentful-types";
import { StyledImage } from "../components/StyledImage";
import styles from "../styles/About.module.css";

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
      <div className={styles.container}>blah</div>
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
