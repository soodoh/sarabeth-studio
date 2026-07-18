import {
	SES,
	type SESClientConfig,
	type SendEmailCommandInput,
	type SendEmailCommandOutput,
} from "@aws-sdk/client-ses";
import { normalizeEmailData } from "@/utils/email";
import {
	createEmailRateLimiter,
	type EmailRateLimiter,
} from "@/utils/email-rate-limit.server";
import type { EmailData } from "@/utils/types";

const sendEmail = "contact@sarabethbelon.com";
const receiveEmail = "sarabethstudio@gmail.com";

export interface EmailSender {
	sendEmail(input: SendEmailCommandInput): Promise<SendEmailCommandOutput>;
}

export interface EmailDependencies {
	createRateLimiter(): EmailRateLimiter;
	createSender(): EmailSender;
}

const getEmailMessage = (emailData: EmailData): SendEmailCommandInput => ({
	Destination: {
		ToAddresses: [receiveEmail],
	},
	Message: {
		Body: {
			Text: {
				Charset: "UTF-8",
				Data: [
					emailData.message,
					"",
					`Email From: ${emailData.name}`,
					emailData.email,
				].join("\n"),
			},
		},
		Subject: {
			Charset: "UTF-8",
			Data: `Website Email: ${emailData.subject}`,
		},
	},
	Source: sendEmail,
	ReplyToAddresses: [emailData.email],
});

const maximumRequestBytes = 32_768;

class RequestBodyTooLargeError extends Error {}

const getRateLimitIdentity = (request: Request): string => {
	const forwardedFor = request.headers.get("x-forwarded-for");
	return forwardedFor?.split(",").at(-1)?.trim() || "unknown";
};

const readJsonBody = async (request: Request): Promise<unknown> => {
	const contentLength = Number(request.headers.get("content-length"));
	if (Number.isFinite(contentLength) && contentLength > maximumRequestBytes) {
		throw new RequestBodyTooLargeError();
	}
	if (!request.body) {
		throw new SyntaxError("Request body is empty");
	}

	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let bodyLength = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		bodyLength += value.byteLength;
		if (bodyLength > maximumRequestBytes) {
			throw new RequestBodyTooLargeError();
		}
		chunks.push(value);
	}

	const body = new Uint8Array(bodyLength);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
};

type SesClientFactory = (configuration: SESClientConfig) => EmailSender;

const createSesClient: SesClientFactory = (configuration) =>
	new SES(configuration);

export const createEmailSender = (
	clientFactory: SesClientFactory = createSesClient,
): EmailSender => {
	const client = clientFactory({ region: "us-west-2" });
	return {
		sendEmail: (input) => client.sendEmail(input),
	};
};

const productionEmailDependencies: EmailDependencies = {
	createRateLimiter: () => createEmailRateLimiter(),
	createSender: () => createEmailSender(),
};

export const handleEmailRequest = async (
	request: Request,
	dependencies?: EmailDependencies,
): Promise<Response> => {
	const contentType = request.headers.get("content-type")?.split(";", 1)[0];
	if (!dependencies) {
		console.info("Contact email request received", {
			contentType: contentType?.trim().toLowerCase() ?? "missing",
		});
	}
	if (contentType?.trim().toLowerCase() !== "application/json") {
		return Response.json(
			{ error: "Content-Type must be application/json" },
			{ status: 415 },
		);
	}

	let body: unknown;
	try {
		body = await readJsonBody(request);
	} catch (error) {
		if (error instanceof RequestBodyTooLargeError) {
			return Response.json(
				{ error: "Request body is too large" },
				{ status: 413 },
			);
		}
		return Response.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const emailData = normalizeEmailData(body);
	if (!emailData) {
		return Response.json({ error: "Invalid email request" }, { status: 400 });
	}

	try {
		const emailDependencies = dependencies ?? productionEmailDependencies;
		const limiter = emailDependencies.createRateLimiter();
		if (!(await limiter.consume(getRateLimitIdentity(request)))) {
			return Response.json(
				{ error: "Too many email requests" },
				{ status: 429, headers: { "Retry-After": "300" } },
			);
		}

		const emailResponse = await emailDependencies
			.createSender()
			.sendEmail(getEmailMessage(emailData));
		return Response.json(emailResponse, { status: 200 });
	} catch (error) {
		console.error("Failed to send contact email", error);
		return Response.json({ error: "Unable to send email" }, { status: 500 });
	}
};
