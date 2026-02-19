/* oxlint-disable typescript-eslint/explicit-module-boundary-types, unicorn/no-useless-switch-case */
import ArrowButton from "@/components/ArrowButton";
import ImageWrapper from "@/components/ImageWrapper";
import { LessonsPages } from '@/utils/types';
import type { LessonsData } from '@/utils/types';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import React from "react";

type Props = {
  section: LessonsPages;
  lessonsData: LessonsData;
};

const richTextClasses = "leading-7 [&_h1]:text-[2rem] [&_p]:mb-8";

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
    case LessonsPages.Studio: {
      return (
        <div className="my-12 grid grid-cols-[1fr_auto_1fr] gap-16 max-sm:grid-cols-1">
          <div className={richTextClasses}>
            {documentToReactComponents(teachingPhilosophy)}
          </div>
          <div className="mx-auto h-1/2 w-px bg-accent max-sm:h-px max-sm:w-1/2" />
          <div className={richTextClasses}>
            {documentToReactComponents(studioExpectations)}
          </div>
        </div>
      );
    }
    case LessonsPages.Resume: {
      return (
        <div className={`my-12 ${richTextClasses}`}>
          {documentToReactComponents(teachingResume)}
        </div>
      );
    }
    case LessonsPages.About:
    default: {
      return (
        <div className="my-12 grid grid-cols-[1fr_auto_1fr] gap-16 max-sm:grid-cols-1">
          <div className={richTextClasses}>
            {documentToReactComponents(aboutDescription)}
          </div>
          <div className="mx-auto h-1/2 w-px self-center bg-accent max-sm:h-px max-sm:w-1/2" />
          <div>
            <div className="w-1/2">
              <ImageWrapper image={socialMediaImage} />
            </div>
            <div className={richTextClasses}>
              {documentToReactComponents(socialMediaDescription)}
            </div>
            <ArrowButton label="Follow Me" url={followLink} />
          </div>
        </div>
      );
    }
  }
};

export default LessonsPageSections;
