"use client";

import SvgLogo from "@/components/icons/Logo";
import LessonsPageSections from "@/components/LessonsPageSections";
import WidthContainer from "@/components/WidthContainer";
import buttonStyles from "@/styles/Button.module.css";
import { type LessonsData, LessonsPages } from "@/utils/types";
import Link from "next/link";
import { useState } from "react";
import styles from "./LessonsSections.module.css";

const LessonsPageContent = ({ lessonsData }: { lessonsData: LessonsData }) => {
  const { email, phoneNumber, reviewLink } = lessonsData;
  const [section, setSection] = useState(LessonsPages.About);

  return (
    <>
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
        <LessonsPageSections section={section} lessonsData={lessonsData} />
        <div className={styles.contact}>
          <SvgLogo className={styles.contactImage} />
          <h1>Contact</h1>
          <div className={styles.contactLinks}>
            <a href={`mailto:${email}`}>{email}</a>
            <a href={`tel:${phoneNumber.replace(/\D+/g, "")}`}>{phoneNumber}</a>
          </div>
          <Link href="/contact" className={buttonStyles.container}>
            Book a Lesson
          </Link>
          <Link href={reviewLink} className={buttonStyles.container}>
            View Reviews
          </Link>
        </div>
      </WidthContainer>
    </>
  );
};

export default LessonsPageContent;
