"use client";

import LoadingCircle from "@/components/LoadingCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import WidthContainer from "@/components/WidthContainer";
import { brandButtonClasses, cn } from "@/lib/utils";
import { useState } from "react";
import type { EmailData } from "@/utils/types";

const isInvalid = (values: Partial<EmailData>) => {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/;
  if (values.email && !emailRegex.test(values.email)) {
    return true;
  }
  return Object.values(values).some((value) => !value);
};

const fieldClasses = "py-2.5 text-base font-sans";

const labelClasses =
  "text-sm font-medium text-accent has-[+_*:focus]:text-foreground";

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

  const nameError = showErrors && isInvalid({ name });
  const emailError = showErrors && isInvalid({ email });
  const subjectError = showErrors && isInvalid({ subject });
  const messageError = showErrors && isInvalid({ message });

  return (
    <WidthContainer className="flex flex-col [&>h1]:mx-auto [&>h1]:my-16">
      {sendState === "success" && <h1>Message successfully sent!</h1>}
      {sendState === "fail" && <h1>Message failed to send</h1>}
      {!sendState && (
        <form onSubmit={submit}>
          <div className="my-4 w-[60%] max-sm:w-full">
            <div className="space-y-1.5">
              <Label
                htmlFor="Name"
                className={cn(labelClasses, nameError && "text-red-600")}
              >
                Name
              </Label>
              <Input
                className={cn(fieldClasses, nameError && "!border-red-600")}
                name="Name"
                id="Name"
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
                aria-invalid={nameError}
                aria-required="true"
                aria-describedby="Name-error"
                required
              />
              {nameError && (
                <p
                  role="alert"
                  id="Name-error"
                  className="text-[0.8rem] text-red-600"
                >
                  &quot;Name&quot; is a required field
                </p>
              )}
            </div>
          </div>
          <div className="my-4 w-[60%] max-sm:w-full">
            <div className="space-y-1.5">
              <Label
                htmlFor="Email"
                className={cn(labelClasses, emailError && "text-red-600")}
              >
                Email
              </Label>
              <Input
                className={cn(fieldClasses, emailError && "!border-red-600")}
                name="Email"
                id="Email"
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                value={email}
                aria-invalid={emailError}
                aria-required="true"
                aria-describedby="Email-error"
                required
              />
              {emailError && (
                <p
                  role="alert"
                  id="Email-error"
                  className="text-[0.8rem] text-red-600"
                >
                  Please enter a valid email
                </p>
              )}
            </div>
          </div>
          <div className="my-4 w-[60%] max-sm:w-full">
            <div className="space-y-1.5">
              <Label
                htmlFor="Subject"
                className={cn(labelClasses, subjectError && "text-red-600")}
              >
                Subject
              </Label>
              <Input
                className={cn(fieldClasses, subjectError && "!border-red-600")}
                name="Subject"
                id="Subject"
                disabled={loading}
                onChange={(e) => setSubject(e.target.value)}
                type="text"
                value={subject}
                aria-invalid={subjectError}
                aria-required="true"
                aria-describedby="Subject-error"
                required
              />
              {subjectError && (
                <p
                  role="alert"
                  id="Subject-error"
                  className="text-[0.8rem] text-red-600"
                >
                  &quot;Subject&quot; is a required field
                </p>
              )}
            </div>
          </div>
          <div className="my-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="Message"
                className={cn(labelClasses, messageError && "text-red-600")}
              >
                Message
              </Label>
              <Textarea
                className={cn(
                  fieldClasses,
                  "resize-none",
                  messageError && "!border-red-600",
                )}
                name="Message"
                id="Message"
                disabled={loading}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                aria-invalid={messageError}
                aria-required="true"
                aria-describedby="Message-error"
                rows={10}
                required
              />
              {messageError && (
                <p
                  role="alert"
                  id="Message-error"
                  className="text-[0.8rem] text-red-600"
                >
                  &quot;Message&quot; is a required field
                </p>
              )}
            </div>
          </div>
          <div className="my-4 w-[60%] max-sm:w-full">
            {loading ? (
              <LoadingCircle />
            ) : (
              <Button
                type="submit"
                variant="unstyled"
                size="unstyled"
                className={brandButtonClasses}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      )}
    </WidthContainer>
  );
};

export default ContactContent;
