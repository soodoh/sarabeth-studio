import type { EmailData } from "@/utils/types";

export const emailFieldLimits = {
	name: 100,
	email: 254,
	subject: 200,
	message: 5_000,
} as const;

export const isValidEmailAddress = (value: string): boolean => {
	const email = value.trim();
	if (email.length === 0 || email.length > emailFieldLimits.email) {
		return false;
	}

	const parts = email.split("@");
	if (parts.length !== 2) {
		return false;
	}
	const [localPart, domain] = parts;
	if (
		!localPart ||
		localPart.length > 64 ||
		!domain ||
		/^\.|\.$|\.\./.test(localPart) ||
		!/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/i.test(localPart)
	) {
		return false;
	}

	const domainLabels = domain.split(".");
	const topLevelDomain = domainLabels.at(-1) ?? "";
	const hasValidTopLevelDomain =
		/^[a-z]{2,63}$/i.test(topLevelDomain) ||
		/^xn--[a-z0-9-]{1,59}$/i.test(topLevelDomain);
	return (
		domainLabels.length > 1 &&
		domainLabels.every(
			(label) =>
				label.length > 0 &&
				label.length <= 63 &&
				/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label),
		) &&
		hasValidTopLevelDomain
	);
};

export const isValidEmailField = (
	field: keyof EmailData,
	value: string,
): boolean => {
	const normalizedValue = value.trim();
	return (
		normalizedValue.length > 0 &&
		normalizedValue.length <= emailFieldLimits[field] &&
		(field !== "email" || isValidEmailAddress(normalizedValue))
	);
};

export const normalizeEmailData = (body: unknown): EmailData | undefined => {
	if (
		!body ||
		typeof body !== "object" ||
		!("name" in body) ||
		typeof body.name !== "string" ||
		!("email" in body) ||
		typeof body.email !== "string" ||
		!("subject" in body) ||
		typeof body.subject !== "string" ||
		!("message" in body) ||
		typeof body.message !== "string"
	) {
		return undefined;
	}

	const emailData: EmailData = {
		name: body.name.trim(),
		email: body.email.trim(),
		subject: body.subject.trim(),
		message: body.message.trim(),
	};
	if (
		!isValidEmailField("name", emailData.name) ||
		!isValidEmailField("email", emailData.email) ||
		!isValidEmailField("subject", emailData.subject) ||
		!isValidEmailField("message", emailData.message)
	) {
		return undefined;
	}

	return emailData;
};
