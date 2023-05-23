import Head from "next/head";
import styles from "./PageLayout.module.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import type { CommonData } from "../../utils/types";
import type { ReactNode } from "react";

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

        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <Header brandName={commonData.brandName} />
      <main>{children}</main>
      <Footer
        location={commonData.location}
        socialMediaLinks={commonData.socialMediaLinks}
      />
    </div>
  );
};

export default PageLayout;
