import { GetStaticProps } from "next";
import React from "react";
import PageLayout from "../../components/PageLayout";
import type { PageProps } from "../../utils/fetchers/common";
import getCommonData from "../../utils/fetchers/common";

interface Props extends PageProps {}

const Lessons = (props: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "Singing Lessons | Los Angeles",
        description:
          "Offering the very best singing lessons in Los Angeles. Refine your voice, sing with ease, and perfect your craft. Book your lesson now!",
        keywords: [
          "singing lessons los angeles",
          "voice lessons los angeles",
          "singing coach los angeles",
        ],
      }}
      commonData={props.commonData}
    >
      some stuff
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await getCommonData();
  return { props: { commonData } };
};

export default Lessons;
