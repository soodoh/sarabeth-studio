import { GetStaticProps } from "next";
import React, { useState } from "react";
import BannerImage from "../../components/BannerImage";
import PageLayout from "../../components/PageLayout";
import WidthContainer from "../../components/WidthContainer";
import getCommonData from "../../utils/fetchers/common";
import styles from "./Lessons.module.scss";
import type { PageProps } from "../../utils/fetchers/common";

const Lessons = ({ commonData }: PageProps) => {
  const [section, setSection] = useState("about");
  return (
    <PageLayout
      metadata={{
        title: "Singing Lessons | Los Angeles",
        description:
          "Offering the very best singing lessons in Los Angeles. Refine your voice, sing with ease, and perfect your craft. Book your lesson now!",
        keywords: [
          "singing lessons los angeles",
          "voice lessons los angeles",
          "singing coach los angeles",
        ],
      }}
      commonData={commonData}
    >
      <BannerImage image={""} title="Voice Lessons" />
      <div className={styles.navigation}>
        <a onClick={() => setSection("about")}>About</a>
        <a onClick={() => setSection("resume")}>Teaching Resume</a>
      </div>
      <WidthContainer className={styles.container}>
        <div className={styles.info}>info</div>
        <div className={styles.socialMedia}>social media</div>
        <div className={styles.contact}>contact</div>
      </WidthContainer>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [commonData] = await Promise.all([getCommonData()]);
  return { props: { commonData } };
};

export default Lessons;
