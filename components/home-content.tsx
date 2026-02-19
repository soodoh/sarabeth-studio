"use client";

import ArrowButton from "@/components/arrow-button";
import SvgLogo from "@/components/icons/logo";
import StyledImage from "@/components/styled-image";
import WidthContainer from "@/components/width-container";
import { cn } from "@/lib/utils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { motion } from "motion/react";
import type { HomeData } from "@/utils/types";

const isTeachingSection = (name: string): boolean => {
  return /sarabeth'?s\s*studio/gi.test(name);
};

const makeRelativeUrl = (url: string): string => {
  return url.replace(/^https?:\/\/(.+\.)?sarabethbelon\.com/, "");
};

const animateProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true },
  transition: { duration: 1 },
  variants: { visible: { opacity: 1 }, hidden: { opacity: 0 } },
};

const HomeContent = ({ homeData }: { homeData: HomeData[] }): JSX.Element => {
  return (
    <WidthContainer>
      {homeData.map((homeRow, rowIndex) => {
        const isTeaching = isTeachingSection(homeRow.title);
        const isReversed = rowIndex % 2 === 1;

        return (
          <div
            key={homeRow.id}
            className={cn(
              "mb-24 flex",
              isReversed && "flex-row-reverse",
              "max-sm:flex-col",
            )}
          >
            <div className={cn("grow", isTeaching ? "mt-24" : "")}>
              {homeRow.images.map((image) => {
                const isMultiple = homeRow.images.length > 1;
                const isPortrait = image.width < image.height;
                const isLandscape = image.width >= image.height;

                return (
                  <motion.div
                    key={image.id}
                    className={cn(
                      isMultiple &&
                        isPortrait &&
                        "relative z-2 mx-auto w-[60%] [&:not(:first-child)]:mt-[-10%] [&:not(:first-child)]:ml-[30%]",
                      isMultiple &&
                        isLandscape &&
                        "relative z-0 [&:not(:first-child)]:mt-[-40%] [&:not(:first-child)]:mr-[40%] [&:not(:first-child)]:-ml-[40%] max-sm:[&:not(:first-child)]:mt-[-4%] max-sm:[&:not(:first-child)]:ml-0 max-sm:[&:not(:first-child)]:mr-0",
                    )}
                    {...animateProps}
                  >
                    <StyledImage
                      priority={rowIndex < 2}
                      overlayDirection={
                        image.width > image.height ? "left" : "right"
                      }
                      image={image}
                    />
                  </motion.div>
                );
              })}
            </div>
            <motion.div
              className={cn(
                homeRow.mainSection
                  ? "ml-16 flex w-[60%] items-center font-serif text-[2rem]"
                  : cn("min-w-[30%]", isReversed ? "mr-16" : "ml-16"),
                isTeaching && "w-[40%]",
                "max-sm:ml-0 max-sm:mr-0 max-sm:mt-20 max-sm:w-full",
              )}
              {...animateProps}
              transition={{ duration: 2 }}
            >
              {isTeaching && <SvgLogo className="ml-12 w-60 fill-accent" />}
              {!homeRow.mainSection && (
                <>
                  <h1 className="m-0 font-serif text-[3rem]">
                    {homeRow.title}
                  </h1>
                  <h2 className="font-sans text-[1.2rem] uppercase">
                    {homeRow.subtitle}
                  </h2>
                  <div className="h-[0.15rem] w-6 bg-foreground" />
                </>
              )}
              <div>{documentToReactComponents(homeRow.description)}</div>
              {homeRow.buttonLink && (
                <ArrowButton
                  label={homeRow.buttonText}
                  url={makeRelativeUrl(homeRow.buttonLink)}
                />
              )}
            </motion.div>
          </div>
        );
      })}
    </WidthContainer>
  );
};

export default HomeContent;
