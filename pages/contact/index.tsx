import { GetStaticProps } from "next";
import React, { useState } from "react";
import PageLayout from "../../components/PageLayout";
import TextInput from "../../components/TextInput";
import WidthContainer from "../../components/WidthContainer";
import getCommonData from "../../utils/fetchers/common";
import type { PageProps } from "../../utils/fetchers/common";

const Contact = ({ commonData }: PageProps) => {
  const [value, setValue] = useState("");
  return (
    <PageLayout
      metadata={{
        title: "Contact Sarabeth",
        description:
          "Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons.",
      }}
      commonData={commonData}
    >
      <WidthContainer>
        <TextInput
          label="Name"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </WidthContainer>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await getCommonData();
  return { props: { commonData } };
};

export default Contact;
