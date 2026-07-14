import {
	SES,
	type SendEmailCommandInput,
	type SendEmailCommandOutput,
} from "@aws-sdk/client-ses";
import type { EmailData } from "@/utils/types";

const sendEmail = "contact@sarabethbelon.com";
const receiveEmail = "sarabethstudio@gmail.com";

export interface EmailSender {
	sendEmail(input: SendEmailCommandInput): Promise<SendEmailCommandOutput>;
}

const getEmailMessage = (emailData: EmailData): SendEmailCommandInput => ({
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
});

const validateEmailData = (body: unknown): body is EmailData => {
	if (!body || typeof body !== "object") {
		return false;
	}

	return (
		"name" in body &&
		typeof body.name === "string" &&
		body.name !== "" &&
		"email" in body &&
		typeof body.email === "string" &&
		body.email !== "" &&
		"subject" in body &&
		typeof body.subject === "string" &&
		body.subject !== "" &&
		"message" in body &&
		typeof body.message === "string" &&
		body.message !== ""
	);
};

const createEmailSender = (): EmailSender => {
	const client = new SES({
		region: "us-west-2",
		credentials: {
			accessKeyId: process.env.AWS_ACCESS ?? "",
			secretAccessKey: process.env.AWS_SECRET ?? "",
		},
	});
	return {
		sendEmail: (input) => client.sendEmail(input),
	};
};

export const handleEmailRequest = async (
	request: Request,
	sender?: EmailSender,
): Promise<Response> => {
	try {
		const emailData: unknown = await request.json();
		if (!validateEmailData(emailData)) {
			return Response.json(
				{ error: "Missing required inputs in POST body" },
				{ status: 500 },
			);
		}

		const emailResponse = await (sender ?? createEmailSender()).sendEmail(
			getEmailMessage(emailData),
		);
		return Response.json(emailResponse, { status: 200 });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown Error!";
		return Response.json({ error: errorMessage }, { status: 500 });
	}
};
