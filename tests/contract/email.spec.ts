import type {
	SendEmailCommandInput,
	SendEmailCommandOutput,
} from "@aws-sdk/client-ses";
import { expect, test } from "@playwright/test";
import { postEmailRequest } from "@/src/routes/api.email";
import { type EmailSender, handleEmailRequest } from "@/utils/email.server";

const emailData = {
	name: "Test Singer",
	email: "singer@example.com",
	subject: "Lessons",
	message: "I would like more information.",
};

const request = (body: unknown): Request =>
	new Request("http://localhost/api/email", {
		method: "POST",
		body: JSON.stringify(body),
	});

test("sends a validated email through the injected sender", async () => {
	let sentMessage: SendEmailCommandInput | undefined;
	const sender: EmailSender = {
		sendEmail: async (input): Promise<SendEmailCommandOutput> => {
			sentMessage = input;
			return { MessageId: "test-message", $metadata: {} };
		},
	};

	const response = await handleEmailRequest(request(emailData), sender);

	expect(response.status).toBe(200);
	await expect(response.json()).resolves.toEqual({
		MessageId: "test-message",
		$metadata: {},
	});
	expect(sentMessage).toEqual({
		Destination: { ToAddresses: ["sarabethstudio@gmail.com"] },
		Message: {
			Body: {
				Text: {
					Data: `I would like more information.
                    \n\nEmail From: Test Singer
                    \nsinger@example.com`,
				},
			},
			Subject: { Data: "Website Email: Lessons" },
		},
		ReplyToAddresses: ["singer@example.com"],
		Source: "contact@sarabethbelon.com",
	});
});

test("rejects invalid input through the registered route adapter", async () => {
	const response = await postEmailRequest({ request: request({}) });

	expect(response.status).toBe(500);
	await expect(response.json()).resolves.toEqual({
		error: "Missing required inputs in POST body",
	});
});

test("serializes sender failures", async () => {
	const sender: EmailSender = {
		sendEmail: async () => {
			throw new Error("SES unavailable");
		},
	};

	const response = await handleEmailRequest(request(emailData), sender);

	expect(response.status).toBe(500);
	await expect(response.json()).resolves.toEqual({ error: "SES unavailable" });
});
