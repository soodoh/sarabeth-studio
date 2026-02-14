import ArrowButton from "@/components/ArrowButton";
import StyledImage from "@/components/StyledImage";
import WidthContainer from "@/components/WidthContainer";
import getAboutData from "@/utils/fetchers/about";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import React from "react";
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
    <WidthContainer className="mb-16 grid grid-cols-[30%_1fr] gap-16 max-sm:grid-cols-1">
      <div className="max-sm:max-w-[300px]">
        <StyledImage overlayDirection="right" image={headshot} priority />
      </div>
      <div className="leading-7 [&_h1]:text-[3rem] [&_h1]:leading-[3.5rem] [&_p]:mb-8">
        {documentToReactComponents(bio)}
        <ArrowButton url={resume} label="View Resume" />
      </div>
    </WidthContainer>
  );
};

export default About;
