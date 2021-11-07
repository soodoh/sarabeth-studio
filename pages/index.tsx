import type { NextPage, GetStaticProps } from "next";
import StyledImage from "../components/StyledImage";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import styles from "../styles/Home.module.css";
import PageLayout from "../components/PageLayout";
import { getCommonData, getHomeData, getClient } from "../util/contentful-util";
import { CommonData, HomeData } from "../util/contentful-types";
import ArrowSvg from "../public/arrow.svg";

interface Props {
  commonData: CommonData;
  homeData: HomeData[];
}

const Home = (props: Props) => {
  const isTeachingSection = (name: string) => {
    return /sarabeth'?s\s*studio/gi.test(name);
  };
  const getImageClasses = (
    totalImageNum: number,
    width: number,
    height: number
  ) => {
    const isPortrait = width < height;
    const classes: string[] = [];
    if (totalImageNum <= 1) return classes;
    if (width < height) classes.push(styles.portraitImage);
    classes.push(styles.landscapeImage);
    return classes;
  };

  return (
    <PageLayout
      metadata={{
        title: "Sarabeth Belón: Portfolio",
        description:
          "Sarabeth Belon, a young female opera singer, captivates audiences with her tessitura and repertoire versatility. Learn more about this artist!",
        keywords: ["young female opera singer", "opera singer los angeles"],
      }}
      commonData={props.commonData}
    >
      <div className={styles.container}>
        {props.homeData.map((homeRow) => (
          <div key={homeRow.id} className={styles.homeRow}>
            <div className={styles.rowImages}>
              {homeRow.images.map((image) => (
                <div key={image.id} className={styles.image}>
                  <div
                    className={getImageClasses(
                      homeRow.images.length,
                      image.width,
                      image.height
                    ).join(" ")}
                  >
                    <StyledImage
                      type={image.width > image.height ? "left" : "right"}
                      image={image}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div
              className={`${
                homeRow.mainSection
                  ? styles.mainTextSection
                  : styles.textSection
              } ${isTeachingSection(homeRow.title) && styles.teachingSection}`}
            >
              {!homeRow.mainSection && (
                <>
                  <h1 className={styles.title}>{homeRow.title}</h1>
                  <h3 className={styles.subtitle}>{homeRow.subtitle}</h3>
                  <div className={styles.divider} />
                </>
              )}
              <div className={styles.description}>
                {documentToReactComponents(homeRow.description)}
              </div>
              {homeRow.buttonLink && (
                <a className={styles.buttonContainer} href={homeRow.buttonLink}>
                  <div className={styles.buttonText}>
                    {homeRow.buttonText || "Click Here"}
                  </div>
                  <ArrowSvg className={styles.arrowSvg} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [commonData, homeData] = await Promise.all([
    getCommonData(),
    getHomeData(),
  ]);
  return { props: { commonData, homeData } };
};

export default Home;
