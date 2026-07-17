import type {
	SESClientConfig,
	SendEmailCommandInput,
	SendEmailCommandOutput,
} from "@aws-sdk/client-ses";
import { expect, test } from "@playwright/test";
import { postEmailRequest } from "@/src/routes/api.email";
import { emailFieldLimits } from "@/utils/email";
import {
	createEmailSender,
	type EmailSender,
	handleEmailRequest,
} from "@/utils/email.server";

const emailData = {
	name: "Test Singer",
	email: "singer@example.com",
	subject: "Lessons",
	message: "I would like more information.",
};

const rawRequest = (body: string, contentType = "application/json"): Request =>
	new Request("http://localhost/api/email", {
		method: "POST",
		headers: { "Content-Type": contentType },
		body,
	});

const request = (body: unknown): Request => rawRequest(JSON.stringify(body));

const binaryRequest = (body: Uint8Array): Request =>
	new Request("http://localhost/api/email", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: Uint8Array.from(body).buffer,
	});

test("configures SES to use the default AWS credential provider chain", () => {
	let clientConfiguration: SESClientConfig | undefined;
	const sender = createEmailSender((configuration) => {
		clientConfiguration = configuration;
		return {
			sendEmail: async (): Promise<SendEmailCommandOutput> => ({
				MessageId: "test-message",
				$metadata: {},
			}),
		};
	});

	expect(sender.sendEmail).toEqual(expect.any(Function));
	expect(clientConfiguration).toEqual({ region: "us-west-2" });
});

const createTrackingSender = (): {
	sender: EmailSender;
	getCalls: () => number;
} => {
	let calls = 0;
	return {
		sender: {
			sendEmail: async (): Promise<SendEmailCommandOutput> => {
				calls += 1;
				return { MessageId: "test-message", $metadata: {} };
			},
		},
		getCalls: () => calls,
	};
};

test("sends a normalized email through the injected sender", async () => {
	let sentMessage: SendEmailCommandInput | undefined;
	const sender: EmailSender = {
		sendEmail: async (input): Promise<SendEmailCommandOutput> => {
			sentMessage = input;
			return { MessageId: "test-message", $metadata: {} };
		},
	};

	const response = await handleEmailRequest(
		request({
			name: `  ${emailData.name}  `,
			email: ` ${emailData.email} `,
			subject: ` ${emailData.subject} `,
			message: ` ${emailData.message} `,
		}),
		sender,
	);

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
					Charset: "UTF-8",
					Data: `I would like more information.
                    \n\nEmail From: Test Singer
                    \nsinger@example.com`,
				},
			},
			Subject: { Charset: "UTF-8", Data: "Website Email: Lessons" },
		},
		ReplyToAddresses: ["singer@example.com"],
		Source: "contact@sarabethbelon.com",
	});
});

test("accepts a 64-character email local part", async () => {
	const { sender, getCalls } = createTrackingSender();
	const response = await handleEmailRequest(
		request({ ...emailData, email: `${"a".repeat(64)}@example.com` }),
		sender,
	);

	expect(response.status).toBe(200);
	expect(getCalls()).toBe(1);
});

test("accepts a punycode top-level domain", async () => {
	const { sender, getCalls } = createTrackingSender();
	const response = await handleEmailRequest(
		request({ ...emailData, email: "singer@example.xn--p1ai" }),
		sender,
	);

	expect(response.status).toBe(200);
	expect(getCalls()).toBe(1);
});

test("rejects invalid input through the registered route adapter", async () => {
	const response = await postEmailRequest({ request: request({}) });

	expect(response.status).toBe(400);
	await expect(response.json()).resolves.toEqual({
		error: "Invalid email request",
	});
});

const invalidRequests = [
	{
		name: "wrong field type",
		body: { ...emailData, email: 42 },
	},
	{
		name: "whitespace-only field",
		body: { ...emailData, name: "   " },
	},
	{
		name: "malformed email address",
		body: { ...emailData, email: "not-an-email" },
	},
	{
		name: "consecutive dots in email address",
		body: { ...emailData, email: "singer@example..com" },
	},
	{
		name: "comma in email local part",
		body: { ...emailData, email: "first,last@example.com" },
	},
	{
		name: "colon in email local part",
		body: { ...emailData, email: "first:last@example.com" },
	},
	{
		name: "angle brackets in email local part",
		body: { ...emailData, email: "<singer>@example.com" },
	},
	{
		name: "oversized name",
		body: { ...emailData, name: "x".repeat(emailFieldLimits.name + 1) },
	},
	{
		name: "oversized email local part",
		body: { ...emailData, email: `${"x".repeat(65)}@example.com` },
	},
	{
		name: "oversized email",
		body: {
			...emailData,
			email: `${"x".repeat(emailFieldLimits.email)}@example.com`,
		},
	},
	{
		name: "oversized subject",
		body: { ...emailData, subject: "x".repeat(emailFieldLimits.subject + 1) },
	},
	{
		name: "oversized message",
		body: { ...emailData, message: "x".repeat(emailFieldLimits.message + 1) },
	},
] as const;

for (const invalidRequest of invalidRequests) {
	test(`rejects ${invalidRequest.name} without calling the sender`, async () => {
		const { sender, getCalls } = createTrackingSender();

		const response = await handleEmailRequest(
			request(invalidRequest.body),
			sender,
		);

		expect(response.status).toBe(400);
		await expect(response.json()).resolves.toEqual({
			error: "Invalid email request",
		});
		expect(getCalls()).toBe(0);
	});
}

test("rejects malformed JSON without calling the sender", async () => {
	const { sender, getCalls } = createTrackingSender();

	const response = await handleEmailRequest(rawRequest("{"), sender);

	expect(response.status).toBe(400);
	await expect(response.json()).resolves.toEqual({
		error: "Invalid JSON body",
	});
	expect(getCalls()).toBe(0);
});

test("rejects malformed UTF-8 without calling the sender", async () => {
	const { sender, getCalls } = createTrackingSender();
	const body = new TextEncoder().encode(
		JSON.stringify({ ...emailData, message: "MARKER" }),
	);
	const markerIndex = body.indexOf("M".charCodeAt(0));
	if (markerIndex === -1) {
		throw new Error("Malformed UTF-8 fixture marker is missing");
	}
	body[markerIndex] = 0x80;

	const response = await handleEmailRequest(binaryRequest(body), sender);

	expect(response.status).toBe(400);
	await expect(response.json()).resolves.toEqual({
		error: "Invalid JSON body",
	});
	expect(getCalls()).toBe(0);
});

test("rejects unsupported content types without calling the sender", async () => {
	const { sender, getCalls } = createTrackingSender();

	const response = await handleEmailRequest(
		rawRequest(JSON.stringify(emailData), "text/plain"),
		sender,
	);

	expect(response.status).toBe(415);
	await expect(response.json()).resolves.toEqual({
		error: "Content-Type must be application/json",
	});
	expect(getCalls()).toBe(0);
});

test("accepts validation-compliant multibyte request bodies", async () => {
	const { sender, getCalls } = createTrackingSender();
	const response = await handleEmailRequest(
		request({ ...emailData, message: "界".repeat(3_000) }),
		sender,
	);

	expect(response.status).toBe(200);
	expect(getCalls()).toBe(1);
});

test("rejects oversized request bodies before calling the sender", async () => {
	const { sender, getCalls } = createTrackingSender();
	const oversizedBody = JSON.stringify({
		...emailData,
		unexpected: "x".repeat(40_000),
	});

	const response = await handleEmailRequest(rawRequest(oversizedBody), sender);

	expect(response.status).toBe(413);
	await expect(response.json()).resolves.toEqual({
		error: "Request body is too large",
	});
	expect(getCalls()).toBe(0);
});

test("does not expose sender failure details", async () => {
	const sender: EmailSender = {
		sendEmail: async () => {
			throw new Error("SES unavailable");
		},
	};

	const response = await handleEmailRequest(request(emailData), sender);

	expect(response.status).toBe(500);
	await expect(response.json()).resolves.toEqual({
		error: "Unable to send email",
	});
});
