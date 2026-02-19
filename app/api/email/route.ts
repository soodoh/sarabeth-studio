import { SES } from "@aws-sdk/client-ses";
import type { EmailData } from "@/utils/types";

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

function validateEmailData(body: Record<string, unknown>) {
  const keys = ["name", "email", "subject", "message"];
  return keys.some((key) => !body[key] || typeof body[key] !== "string");
}

export async function POST(req: Request) {
  try {
    const emailData = await req.json();
    if (validateEmailData(emailData)) {
      return Response.json(
        { error: "Missing required inputs in POST body" },
        { status: 500 },
      );
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
    return Response.json(emailRes, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Error!";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
