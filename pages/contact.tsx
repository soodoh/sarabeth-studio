import React from "react";
import { GetStaticProps } from "next";
import PageLayout from "../components/PageLayout";
import { getCommonData } from "../util/contentful-util";
import { PageProps } from "../util/contentful-types";

interface Props extends PageProps {}

const Contact = (props: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "Contact Sarabeth",
        description:
          "Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons.",
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
