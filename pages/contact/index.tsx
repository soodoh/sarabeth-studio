import { GetStaticProps } from "next";
import React from "react";
import PageLayout from "../../components/PageLayout";
import type { PageProps } from "../../utils/fetchers/common";
import getCommonData from "../../utils/fetchers/common";

interface Props extends PageProps {}

const Contact = ({ commonData }: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "Contact Sarabeth",
        description:
          "Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons.",
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

export default Contact;
