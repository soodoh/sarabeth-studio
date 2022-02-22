import type { GetStaticProps } from "next";
import StyledImage from "../components/StyledImage";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import styles from "../styles/Home.module.css";
import PageLayout from "../components/PageLayout";
import { getCommonData, getHomeData } from "../util/contentful-util";
import { HomeData } from "../util/contentful-types";
import Button from "../components/Button";
import LogoSvg from "../public/logo.svg";
import { PageProps } from "../util/contentful-types";

interface Props extends PageProps {
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
    if (totalImageNum <= 1) return "";
    if (isPortrait) return styles.portraitImage;
    return styles.landscapeImage;
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
            <div
              className={
                isTeachingSection(homeRow.title)
                  ? styles.teachingImages
                  : styles.rowImages
              }
            >
              {homeRow.images.map((image) => (
                <div
                  key={image.id}
                  className={getImageClasses(
                    homeRow.images.length,
                    image.width,
                    image.height
                  )}
                >
                  <StyledImage
                    type={image.width > image.height ? "left" : "right"}
                    image={image}
                  />
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
              {isTeachingSection(homeRow.title) && (
                <LogoSvg className={styles.logoSvg} />
              )}
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
                <Button label={homeRow.buttonText} url={homeRow.buttonLink} />
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
