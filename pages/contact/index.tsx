import { GetStaticProps } from "next";
import React, { useState } from "react";
import BannerImage from "../../components/BannerImage";
import PageLayout from "../../components/PageLayout";
import TextInput from "../../components/TextInput";
import WidthContainer from "../../components/WidthContainer";
import getCommonData from "../../utils/fetchers/common";
import getContactData from "../../utils/fetchers/contact";
import styles from "./Contact.module.scss";
import type { PageProps } from "../../utils/fetchers/common";
import type { ContactData } from "../../utils/fetchers/contact";

const Contact = ({
  commonData,
  submitPostUrl,
  bannerImage,
}: PageProps & ContactData) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const data = { name, email, subject, message };
  const submit = () => {
    fetch(submitPostUrl, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // turn off errors
        // empty inputs
        // show success
      })
      .catch((_err) => {
        // show error
      })
      .finally(() => {
        // stop loading
      });
  };

  return (
    <PageLayout
      metadata={{
        title: "Contact Sarabeth",
        description:
          "Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons.",
      }}
      commonData={commonData}
    >
      <BannerImage image={bannerImage} title="Contact Sarabeth" />
      <WidthContainer className={styles.container}>
        <div className={styles.inputContainer}>
          <TextInput
            label="Name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            hasError
          />
        </div>
        <div className={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div className={styles.inputContainer}>
          <TextInput
            label="Subject"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
            }}
          />
        </div>
        <div className={styles.textareaContainer}>
          <TextInput
            label="Message"
            type="textarea"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
        </div>
      </WidthContainer>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [commonData, contactData] = await Promise.all([
    getCommonData(),
    getContactData(),
  ]);
  return { props: { commonData, ...contactData } };
};

export default Contact;
