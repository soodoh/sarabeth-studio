import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import NextImage from "next/image";
import React from "react";
import ArrowButton from "../../components/ArrowButton";
import { LessonsPages } from "../../pages/lessons";
import { imageLoader } from "../../utils/contentful";
import styles from "./LessonsPageContent.module.scss";
import type { Image } from "../../utils/contentful";
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
              <NextImage
                loader={imageLoader}
                alt={aboutData.socialMediaImage.description}
                src={aboutData.socialMediaImage.url}
                layout="responsive"
                width={aboutData.socialMediaImage.width}
                height={aboutData.socialMediaImage.height}
              />
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
