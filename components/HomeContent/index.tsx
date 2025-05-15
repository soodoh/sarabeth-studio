"use client";

import ArrowButton from "@/components/ArrowButton";
import SvgLogo from "@/components/icons/Logo";
import StyledImage from "@/components/StyledImage";
import WidthContainer from "@/components/WidthContainer";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { motion } from "framer-motion";
import styles from "./HomeContent.module.css";
import type { HomeData } from "@/utils/types";

const getImageClasses = (
  totalImageNum: number,
  width: number,
  height: number,
) => {
  const isPortrait = width < height;
  if (totalImageNum <= 1) return "";
  if (isPortrait) return styles.portraitImage;
  return styles.landscapeImage;
};

const isTeachingSection = (name: string) => {
  return /sarabeth'?s\s*studio/gi.test(name);
};

const makeRelativeUrl = (url: string) => {
  return url.replace(/^https?:\/\/(.+\.)?sarabethbelon\.com/, "");
};

const animateProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true },
  transition: { duration: 1 },
  variants: { visible: { opacity: 1 }, hidden: { opacity: 0 } },
};

const HomeContent = ({ homeData }: { homeData: HomeData[] }) => {
  return (
    <WidthContainer className={styles.container}>
      {homeData.map((homeRow, rowIndex) => (
        <div key={homeRow.id} className={styles.homeRow}>
          <div
            className={
              isTeachingSection(homeRow.title)
                ? styles.teachingImages
                : styles.rowImages
            }
          >
            {homeRow.images.map((image) => (
              <motion.div
                key={image.id}
                className={getImageClasses(
                  homeRow.images.length,
                  image.width,
                  image.height,
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
            ))}
          </div>
          <motion.div
            className={`${
              homeRow.mainSection ? styles.mainTextSection : styles.textSection
            } ${isTeachingSection(homeRow.title) && styles.teachingSection}`}
            {...animateProps}
            transition={{ duration: 2 }}
          >
            {isTeachingSection(homeRow.title) && (
              <SvgLogo className={styles.logoSvg} />
            )}
            {!homeRow.mainSection && (
              <>
                <h1 className={styles.title}>{homeRow.title}</h1>
                <h2 className={styles.subtitle}>{homeRow.subtitle}</h2>
                <div className={styles.divider} />
              </>
            )}
            <div className={styles.description}>
              {documentToReactComponents(homeRow.description)}
            </div>
            {homeRow.buttonLink && (
              <ArrowButton
                label={homeRow.buttonText}
                url={makeRelativeUrl(homeRow.buttonLink)}
              />
            )}
          </motion.div>
        </div>
      ))}
    </WidthContainer>
  );
};

export default HomeContent;
