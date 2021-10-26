import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import styles from "../styles/Home.module.css";
import PageLayout from "../components/PageLayout";
import { getCommonData, getHomeData, getClient } from "../util/contentful-util";
import { CommonData, HomeData } from "../util/contentful-types";

interface Props {
  commonData: CommonData;
  homeData: HomeData[];
}

const Home = (props: Props) => {
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
                  <Image
                    key={image.id}
                    alt={image.description}
                    src={image.url}
                    layout="responsive"
                    width={image.width}
                    height={image.height}
                  />
                </div>
              ))}
            </div>
            <div
              className={
                homeRow.mainSection ? styles.mainRowText : styles.rowText
              }
            >
              {!homeRow.mainSection && (
                <>
                  <h1>{homeRow.title}</h1>
                  <h3>{homeRow.subtitle}</h3>
                  <hr className={styles.divider} />
                </>
              )}
              <div className={styles.description}>
                {documentToReactComponents(homeRow.description)}
              </div>
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
