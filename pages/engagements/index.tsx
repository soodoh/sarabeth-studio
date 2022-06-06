import { GetStaticProps } from "next";
import React from "react";
import PageLayout from "../../components/PageLayout";
import type { PageProps } from "../../utils/fetchers/common";
import getCommonData from "../../utils/fetchers/common";

interface Props extends PageProps {}

const Engagements = ({ commonData }: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "Sarabeth's Engagements",
        description:
          "Young and talented female opera singer, Sarabeth Belon, captivates audiences throughout the country. Learn more about her current and upcoming engagements!",
        keywords: ["sarabeth belon engagements"],
      }}
      commonData={commonData}
    >
      some stuff
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await getCommonData();
  return { props: { commonData } };
};

export default Engagements;
