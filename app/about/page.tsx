import ArrowButton from "@/components/ArrowButton";
import StyledImage from "@/components/StyledImage";
import WidthContainer from "@/components/WidthContainer";
import getAboutData from "@/utils/fetchers/about";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import React from "react";
import styles from "./About.module.css";
import type { Metadata } from "next";

// Statically generated at build time, will error if any Dynamic APIs are used
export const dynamic = "error";

export const metadata: Metadata = {
  title: "About Sarabeth",
  description:
    "Offering the very best private vocal lessons in Los Angeles. Refine your voice, achieve constant flow of breadth, and sing with ease.",
  keywords: ["vocal lessons los angeles", "piano teacher los angeles"],
  icons: "/favicon.png",
};

const About = async () => {
  const aboutData = await getAboutData();

  const { headshot, bio, resume } = aboutData;

  return (
    <WidthContainer className={styles.container}>
      <div className={styles.headshot}>
        <StyledImage overlayDirection="right" image={headshot} priority />
      </div>
      <div className={styles.bio}>
        {documentToReactComponents(bio)}
        <ArrowButton url={resume} label="View Resume" />
      </div>
    </WidthContainer>
  );
};

export default About;
