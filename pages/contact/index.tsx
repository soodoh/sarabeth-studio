import { GetStaticProps } from "next";
import React, { useState } from "react";
import PageLayout from "../../components/PageLayout";
import TextInput from "../../components/TextInput";
import WidthContainer from "../../components/WidthContainer";
import getCommonData from "../../utils/fetchers/common";
import styles from "./Contact.module.scss";
import type { PageProps } from "../../utils/fetchers/common";

const Contact = ({ commonData }: PageProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  return (
    <PageLayout
      metadata={{
        title: "Contact Sarabeth",
        description:
          "Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons.",
      }}
      commonData={commonData}
    >
      <WidthContainer className={styles.container}>
        <div className={styles.inputContainer}>
          <TextInput
            label="Name"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            hasError
          />
        </div>
        <div className={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div className={styles.inputContainer}>
          <TextInput
            label="Subject"
            value={subject}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSubject(event.target.value);
            }}
          />
        </div>
        <div className={styles.inputContainer}>
          <TextInput
            label="Message"
            value={message}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMessage(event.target.value);
            }}
          />
        </div>
      </WidthContainer>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await getCommonData();
  return { props: { commonData } };
};

export default Contact;
