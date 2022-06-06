import Head from "next/head";
import React, { ReactNode } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import type { CommonData } from "../../utils/fetchers/common";
import styles from "./PageLayout.module.scss";

type Props = {
  metadata: {
    title: string;
    description?: string;
    keywords?: string[];
    robots?: string;
  };
  commonData: CommonData;
  children: ReactNode;
};

const PageLayout = ({ metadata, commonData, children }: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{metadata.title}</title>

        {metadata.description && (
          <meta name="description" content={metadata.description} />
        )}
        {!!metadata.keywords?.length && (
          <meta name="keywords" content={metadata.keywords.join(",")} />
        )}
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Montebello" />
        <meta
          name="google-site-verification"
          content="recDsrmbMWYOcfMC0vEE0asXttST_2d-4VZs1EVtSps"
        />

        <meta name="GOOGLEBOT" content="index, follow" />
        <meta name="ROBOTS" content={metadata.robots || "index, follow"} />
        <meta name="robots" content={metadata.robots || "index, follow"} />
      </Head>

      <Header brandName={commonData.brandName} />

      <main className={styles.mainContent}>{children}</main>

      <Footer
        location={commonData.location}
        socialMediaLinks={commonData.socialMediaLinks}
      />
    </div>
  );
};

export default PageLayout;
