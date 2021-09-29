import React from 'react';
import type { GetStaticProps } from 'next';
import PageLayout from '../components/PageLayout';
import { getCommonData, CommonData } from '../util/contentful-util';

interface Props {
  commonData: CommonData,
}

const About = (props: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "About Sarabeth",
        description: "Offering the very best private vocal lessons in Los Angeles. Refine your voice, achieve constant flow of breadth, and sing with ease.",
        keywords: ['vocal lessons los angeles', 'piano teacher los angeles'],
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

export default About;
