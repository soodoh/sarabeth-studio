import React from 'react';
import type { GetStaticProps } from 'next';
import PageLayout from '../components/PageLayout';
import { getCommonData, CommonData } from '../util/contentful-util';

interface Props {
  commonData: CommonData,
}

const Lessons = (props: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "Singing Lessons | Los Angeles",
        description: "Offering the very best singing lessons in Los Angeles. Refine your voice, sing with ease, and perfect your craft. Book your lesson now!",
        keywords: ['singing lessons los angeles', 'voice lessons los angeles', 'singing coach los angeles'],
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
