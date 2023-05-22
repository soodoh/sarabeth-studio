import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import React from "react";
import styles from "./LessonsPageContent.module.css";
import ArrowButton from "../../components/ArrowButton";
import ImageWrapper from "../../components/ImageWrapper";
import { LessonsPages } from "../../pages/lessons";
import type { Image } from "../../utils/types";
import type { Document } from "@contentful/rich-text-types";

type Props = {
  section: LessonsPages;
  aboutData: {
    aboutDescription: Document;
    socialMediaImage: Image;
    socialMediaDescription: Document;
    followLink: string;
  };
  studioData: {
    teachingPhilosophy: Document;
    studioExpectations: Document;
  };
  teachingResume: Document;
};

const LessonsPageContent = ({
  section,
  aboutData,
  studioData,
  teachingResume,
}: Props) => {
  switch (section) {
    case LessonsPages.Studio:
      return (
        <div className={styles.twoColumns}>
          <div className={styles.richText}>
            {documentToReactComponents(studioData.teachingPhilosophy)}
          </div>
          <div className={styles.separator} />
          <div className={styles.richText}>
            {documentToReactComponents(studioData.studioExpectations)}
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
            {documentToReactComponents(aboutData.aboutDescription)}
          </div>
          <div className={styles.separator} />
          <div className={styles.socialMediaContainer}>
            <div className={styles.imageContainer}>
              <ImageWrapper image={aboutData.socialMediaImage} />
            </div>
            <div className={styles.richText}>
              {documentToReactComponents(aboutData.socialMediaDescription)}
            </div>
            <ArrowButton label="Follow Me" url={aboutData.followLink} />
          </div>
        </div>
      );
  }
};

export default LessonsPageContent;
