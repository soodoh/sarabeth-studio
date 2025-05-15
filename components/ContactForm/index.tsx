"use client";

import LoadingCircle from "@/components/LoadingCircle";
import TextInput from "@/components/TextInput";
import WidthContainer from "@/components/WidthContainer";
import buttonStyles from "@/styles/Button.module.css";
import { useState } from "react";
import styles from "./ContactForm.module.css";
import type { EmailData } from "@/utils/types";

const isInvalid = (values: Partial<EmailData>) => {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (values.email && !emailRegex.test(values.email)) {
    return true;
  }
  return Object.values(values).some((value) => !Boolean(value));
};

const ContactContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendState, setSendState] = useState<"success" | "fail" | null>(null);
  const data: EmailData = { name, email, subject, message };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent page from reloading
    event.preventDefault();
    if (isInvalid(data)) {
      setShowErrors(true);
      return;
    }

    setLoading(true);
    const response = await fetch("/api/email", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      setShowErrors(false);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSendState("success");
    } else {
      const errorBody = await response.json();
      console.error(errorBody);
      setSendState("fail");
    }
    setLoading(false);
  };

  return (
    <WidthContainer className={styles.container}>
      {sendState === "success" && <h1>Message successfully sent!</h1>}
      {sendState === "fail" && <h1>Message failed to send</h1>}
      {!sendState && (
        <form onSubmit={submit}>
          <div className={styles.inputContainer}>
            <TextInput
              label="Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              showError={showErrors && isInvalid({ name })}
              disabled={loading}
            />
          </div>
          <div className={styles.inputContainer}>
            <TextInput
              label="Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              errorMessage="Please enter a valid email"
              showError={showErrors && isInvalid({ email })}
              disabled={loading}
            />
          </div>
          <div className={styles.inputContainer}>
            <TextInput
              label="Subject"
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
              }}
              showError={showErrors && isInvalid({ subject })}
              disabled={loading}
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
              showError={showErrors && isInvalid({ message })}
              disabled={loading}
            />
          </div>
          <div className={styles.inputContainer}>
            {loading ? (
              <LoadingCircle />
            ) : (
              <button type="submit" className={buttonStyles.container}>
                Submit
              </button>
            )}
          </div>
        </form>
      )}
    </WidthContainer>
  );
};

export default ContactContent;
