import React from 'react';
import type { GetStaticProps } from 'next';
import PageLayout from '../components/PageLayout';
import { getCommonData, CommonData } from '../util/contentful-util';

interface Props {
  commonData: CommonData,
}

const Contact = (props: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "Contact Sarabeth",
        description: "Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons.",
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

export default Contact;
