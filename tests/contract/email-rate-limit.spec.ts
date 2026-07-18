import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { expect, test } from "@playwright/test";
import {
	createEmailRateLimiter,
	type EmailRateLimitClient,
} from "@/utils/email-rate-limit.server";

const fixedTime = Date.UTC(2026, 0, 1, 0, 2, 3, 456);
const tableName = "email-rate-limit";

const conditionalFailure = () =>
	new ConditionalCheckFailedException({
		$metadata: {},
		message: "Rate limit reached",
	});

test("consumes caller and global buckets with fixed window and TTL values", async () => {
	const commands: Parameters<EmailRateLimitClient["send"]>[0][] = [];
	const client: EmailRateLimitClient = {
		send: async (command) => {
			commands.push(command);
		},
	};
	const limiter = createEmailRateLimiter(client, tableName, () => fixedTime);

	await expect(limiter.consume("203.0.113.42")).resolves.toBe(true);

	const window = Math.floor(fixedTime / 300_000);
	const expiresAt = String(Math.ceil(fixedTime / 1_000) + 600);
	expect(commands).toHaveLength(2);
	expect(commands[0].input).toMatchObject({
		TableName: tableName,
		Key: {
			window: {
				S: expect.stringMatching(new RegExp(`^caller:[0-9a-f]{64}:${window}$`)),
			},
		},
		UpdateExpression: "SET expiresAt = :expiresAt ADD requestCount :one",
		ConditionExpression:
			"attribute_not_exists(requestCount) OR requestCount < :limit",
		ExpressionAttributeValues: {
			":expiresAt": { N: expiresAt },
			":one": { N: "1" },
			":limit": { N: "10" },
		},
	});
	expect(commands[1].input).toMatchObject({
		TableName: tableName,
		Key: { window: { S: `global:${window}` } },
		ExpressionAttributeValues: {
			":expiresAt": { N: expiresAt },
			":one": { N: "1" },
			":limit": { N: "100" },
		},
	});
});

test("returns false when DynamoDB conditionally rejects a bucket", async () => {
	const client: EmailRateLimitClient = {
		send: async () => {
			throw conditionalFailure();
		},
	};
	const limiter = createEmailRateLimiter(client, tableName, () => fixedTime);

	await expect(limiter.consume("203.0.113.42")).resolves.toBe(false);
});

test("one caller exhausting its quota does not block another caller", async () => {
	const counts = new Map<string, number>();
	const client: EmailRateLimitClient = {
		send: async (command) => {
			const key = command.input.Key?.window?.S;
			const limitValue = command.input.ExpressionAttributeValues?.[":limit"]?.N;
			if (!key || !limitValue) throw new Error("Invalid test command");

			const count = counts.get(key) ?? 0;
			if (count >= Number(limitValue)) throw conditionalFailure();
			counts.set(key, count + 1);
		},
	};
	const limiter = createEmailRateLimiter(client, tableName, () => fixedTime);

	for (let request = 0; request < 10; request += 1) {
		await expect(limiter.consume("203.0.113.42")).resolves.toBe(true);
	}
	await expect(limiter.consume("203.0.113.42")).resolves.toBe(false);
	await expect(limiter.consume("198.51.100.17")).resolves.toBe(true);
});

test("uses the production table when no runtime override is provided", async () => {
	const originalTableName = process.env.EMAIL_RATE_LIMIT_TABLE;
	delete process.env.EMAIL_RATE_LIMIT_TABLE;
	const commands: Parameters<EmailRateLimitClient["send"]>[0][] = [];
	const client: EmailRateLimitClient = {
		send: async (command) => {
			commands.push(command);
		},
	};

	try {
		const limiter = createEmailRateLimiter(client);
		await expect(limiter.consume("203.0.113.42")).resolves.toBe(true);
		expect(commands).toHaveLength(2);
		for (const command of commands) {
			expect(command.input.TableName).toBe("sarabeth-contact-email-rate-limit");
		}
	} finally {
		if (originalTableName === undefined) {
			delete process.env.EMAIL_RATE_LIMIT_TABLE;
		} else {
			process.env.EMAIL_RATE_LIMIT_TABLE = originalTableName;
		}
	}
});

test("requires an explicitly blank rate-limit table before sending a command", async () => {
	let sendCalls = 0;
	const client: EmailRateLimitClient = {
		send: async () => {
			sendCalls += 1;
		},
	};
	const limiter = createEmailRateLimiter(client, "", () => fixedTime);

	await expect(limiter.consume("203.0.113.42")).rejects.toThrow(
		"EMAIL_RATE_LIMIT_TABLE is not configured",
	);
	expect(sendCalls).toBe(0);
});

test("propagates non-conditional DynamoDB failures", async () => {
	const failure = new Error("DynamoDB unavailable");
	const client: EmailRateLimitClient = {
		send: async () => {
			throw failure;
		},
	};
	const limiter = createEmailRateLimiter(client, tableName, () => fixedTime);

	await expect(limiter.consume("203.0.113.42")).rejects.toBe(failure);
});
