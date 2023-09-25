import { SES } from "@aws-sdk/client-ses";
import type { EmailData } from "../../utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

const sendEmail = "contact@sarabethbelon.com";
const receiveEmail = "sarabethstudio@gmail.com";

function getEmailMessage(emailData: EmailData) {
  return {
    Destination: {
      ToAddresses: [receiveEmail],
    },
    Message: {
      Body: {
        Text: {
          Data: `${emailData.message}
                    \n\nEmail From: ${emailData.name}
                    \n${emailData.email}`,
        },
      },
      Subject: {
        Data: `Website Email: ${emailData.subject}`,
      },
    },
    Source: sendEmail,
    ReplyToAddresses: [emailData.email],
  };
}

function validateEmailData(body: any) {
  const keys = ["name", "email", "subject", "message"];
  return keys.some((key) => !body[key] || typeof body[key] !== "string");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const emailData = JSON.parse(req.body);
    if (validateEmailData(emailData)) {
      res.status(500).json({ error: "Missing required inputs in POST body" });
      return;
    }

    const sesClient = new SES({
      region: "us-west-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS ?? "",
        secretAccessKey: process.env.AWS_SECRET ?? "",
      },
    });
    const params = getEmailMessage(emailData);
    const emailRes = await sesClient.sendEmail(params);
    res.status(200).json(emailRes);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown Error!";
    res.status(500).json({ error: errorMessage });
  }
}
