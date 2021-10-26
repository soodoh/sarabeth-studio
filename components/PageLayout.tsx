import React, { ReactNode } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CommonData } from "../util/contentful-types";
import styles from "../styles/PageLayout.module.css";

interface Props {
  metadata: {
    title: string;
    description?: string;
    keywords?: string[];
    robots?: string;
  };
  commonData: CommonData;
  children: ReactNode;
}

const PageLayout = (props: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{props.metadata.title}</title>

        {props.metadata.description && (
          <meta name="description" content={props.metadata.description} />
        )}
        {!!props.metadata.keywords?.length && (
          <meta name="keywords" content={props.metadata.keywords.join(",")} />
        )}
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Montebello" />
        <meta
          name="google-site-verification"
          content="recDsrmbMWYOcfMC0vEE0asXttST_2d-4VZs1EVtSps"
        />

        <meta name="GOOGLEBOT" content="index, follow" />
        <meta
          name="ROBOTS"
          content={props.metadata.robots || "index, follow"}
        />
        <meta
          name="robots"
          content={props.metadata.robots || "index, follow"}
        />
      </Head>

      <Header brandName={props.commonData.brandName} />

      <main>{props.children}</main>

      <Footer
        location={props.commonData.location}
        socialMediaLinks={props.commonData.socialMediaLinks}
      />
    </div>
  );
};

export default PageLayout;
