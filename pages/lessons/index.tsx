import { GetStaticProps } from "next";
import React, { useState } from "react";
import styles from "./Lessons.module.css";
import BannerImage from "../../components/BannerImage";
import LessonsPageContent from "../../components/LessonsPageContent";
import Link from "../../components/Link";
import PageLayout from "../../components/PageLayout";
import WidthContainer from "../../components/WidthContainer";
import LogoSvg from "../../public/logo.svg";
import buttonStyles from "../../styles/Button.module.css";
import getCommonData from "../../utils/server/fetchers/common";
import getLessonsData from "../../utils/server/fetchers/lessons";
import type { LessonsData, PageProps } from "../../utils/types";

export enum LessonsPages {
  About = "About",
  Studio = "Studio",
  Resume = "Teaching Resume",
}

const Lessons = ({
  commonData,
  title,
  bannerImage,
  aboutDescription,
  teachingPhilosophy,
  studioExpectations,
  socialMediaImage,
  socialMediaDescription,
  teachingResume,
  followLink,
  email,
  phoneNumber,
  reviewLink,
}: PageProps & LessonsData) => {
  const [section, setSection] = useState(LessonsPages.About);
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
      <BannerImage image={bannerImage} title={title} />
      <div className={styles.navigation}>
        {Object.values(LessonsPages).map((page) => (
          <button
            onClick={() => setSection(page)}
            className={section === page ? styles.activeLink : styles.link}
            key={page}
          >
            {page}
          </button>
        ))}
      </div>
      <WidthContainer className={styles.container}>
        <LessonsPageContent
          section={section}
          aboutData={{
            aboutDescription,
            socialMediaImage,
            socialMediaDescription,
            followLink,
          }}
          studioData={{
            teachingPhilosophy,
            studioExpectations,
          }}
          teachingResume={teachingResume}
        />
        <div className={styles.contact}>
          <LogoSvg className={styles.contactImage} />
          <h1>Contact</h1>
          <div className={styles.contactLinks}>
            <a href={`mailto:${email}`}>{email}</a>
            <a href={`tel:${phoneNumber.replace(/\D+/g, "")}`}>{phoneNumber}</a>
          </div>
          <Link href="/contact" legacyBehavior>
            <a className={buttonStyles.container}>Book a Lesson</a>
          </Link>
          <a href={reviewLink} className={buttonStyles.container}>
            View Reviews
          </a>
        </div>
      </WidthContainer>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [commonData, lessonsData] = await Promise.all([
    getCommonData(),
    getLessonsData(),
  ]);
  return { props: { commonData, ...lessonsData } };
};

export default Lessons;
