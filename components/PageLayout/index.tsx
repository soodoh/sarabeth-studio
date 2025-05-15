import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";
import styles from "./PageLayout.module.css";
import type { CommonData } from "@/utils/types";
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
