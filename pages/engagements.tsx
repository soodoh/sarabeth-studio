import React from 'react';
import type { GetStaticProps } from 'next';
import PageLayout from '../components/PageLayout';
import { getCommonData, CommonData } from '../util/contentful-util';

interface Props {
  commonData: CommonData,
}

const Engagements = (props: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "Sarabeth's Engagements",
        description: "Young and talented female opera singer, Sarabeth Belon, captivates audiences throughout the country. Learn more about her current and upcoming engagements!",
        keywords: ['sarabeth belon engagements'],
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

export default Engagements;
