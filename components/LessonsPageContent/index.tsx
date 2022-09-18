import NextImage from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import Button from "../../components/Button";
import { LessonsPages } from "../../pages/lessons";
import styles from "./LessonsPageContent.module.scss";
import type { Image } from "../../utils/contentful";

type Props = {
  section: LessonsPages;
  aboutData: {
    aboutDescription: string;
    socialMediaImage: Image;
    socialMediaDescription: string;
    followLink: string;
  };
  studioData: {
    teachingPhilosophy: string;
    studioExpectations: string;
  };
  teachingResume: string;
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
          <div className={styles.markdown}>
            <ReactMarkdown>{studioData.teachingPhilosophy}</ReactMarkdown>
          </div>
          <div className={styles.separator} />
          <div className={styles.markdown}>
            <ReactMarkdown>{studioData.studioExpectations}</ReactMarkdown>
          </div>
        </div>
      );
    case LessonsPages.Resume:
      return (
        <div className={`${styles.resumeContainer} ${styles.markdown}`}>
          <ReactMarkdown>{teachingResume}</ReactMarkdown>
        </div>
      );
    case LessonsPages.About:
    default:
      return (
        <div className={styles.twoColumns}>
          <div className={styles.markdown}>
            <ReactMarkdown>{aboutData.aboutDescription}</ReactMarkdown>
          </div>
          <div className={styles.separator} />
          <div className={styles.socialMediaContainer}>
            <div className={styles.imageContainer}>
              <NextImage
                alt={aboutData.socialMediaImage.description}
                src={aboutData.socialMediaImage.url}
                layout="responsive"
                width={aboutData.socialMediaImage.width}
                height={aboutData.socialMediaImage.height}
              />
            </div>
            <div className={styles.markdown}>
              <ReactMarkdown>{aboutData.socialMediaDescription}</ReactMarkdown>
            </div>
            <Button label="Follow Me" url={aboutData.followLink} />
          </div>
        </div>
      );
  }
};

export default LessonsPageContent;
