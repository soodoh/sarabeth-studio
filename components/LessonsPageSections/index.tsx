import ArrowButton from "@/components/ArrowButton";
import ImageWrapper from "@/components/ImageWrapper";
import { type LessonsData, LessonsPages } from "@/utils/types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import React from "react";
import styles from "./LessonsPageContent.module.css";

type Props = {
  section: LessonsPages;
  lessonsData: LessonsData;
};

const LessonsPageSections = ({ section, lessonsData }: Props) => {
  const {
    teachingPhilosophy,
    studioExpectations,
    teachingResume,
    aboutDescription,
    socialMediaImage,
    socialMediaDescription,
    followLink,
  } = lessonsData;
  switch (section) {
    case LessonsPages.Studio:
      return (
        <div className={styles.twoColumns}>
          <div className={styles.richText}>
            {documentToReactComponents(teachingPhilosophy)}
          </div>
          <div className={styles.separator} />
          <div className={styles.richText}>
            {documentToReactComponents(studioExpectations)}
          </div>
        </div>
      );
    case LessonsPages.Resume:
      return (
        <div className={`${styles.resumeContainer} ${styles.richText}`}>
          {documentToReactComponents(teachingResume)}
        </div>
      );
    case LessonsPages.About:
    default:
      return (
        <div className={styles.twoColumns}>
          <div className={styles.richText}>
            {documentToReactComponents(aboutDescription)}
          </div>
          <div className={styles.separator} />
          <div className={styles.socialMediaContainer}>
            <div className={styles.imageContainer}>
              <ImageWrapper image={socialMediaImage} />
            </div>
            <div className={styles.richText}>
              {documentToReactComponents(socialMediaDescription)}
            </div>
            <ArrowButton label="Follow Me" url={followLink} />
          </div>
        </div>
      );
  }
};

export default LessonsPageSections;
