import { createHash } from "node:crypto";
import {
	ConditionalCheckFailedException,
	DynamoDBClient,
	UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

export interface EmailRateLimiter {
	consume(identity: string): Promise<boolean>;
}

export interface EmailRateLimitClient {
	send(command: UpdateItemCommand): Promise<unknown>;
}

const windowSeconds = 300;
const requestsPerCallerWindow = 10;
const requestsPerGlobalWindow = 100;
const productionTableName = "sarabeth-contact-email-rate-limit";

const consumeBucket = async (
	client: EmailRateLimitClient,
	tableName: string,
	key: string,
	limit: number,
	now: number,
): Promise<boolean> => {
	try {
		await client.send(
			new UpdateItemCommand({
				TableName: tableName,
				Key: { window: { S: key } },
				UpdateExpression: "SET expiresAt = :expiresAt ADD requestCount :one",
				ConditionExpression:
					"attribute_not_exists(requestCount) OR requestCount < :limit",
				ExpressionAttributeValues: {
					":expiresAt": {
						N: String(Math.ceil(now / 1_000) + windowSeconds * 2),
					},
					":one": { N: "1" },
					":limit": { N: String(limit) },
				},
			}),
		);
		return true;
	} catch (error) {
		if (error instanceof ConditionalCheckFailedException) return false;
		throw error;
	}
};

export const createEmailRateLimiter = (
	client: EmailRateLimitClient = new DynamoDBClient({ region: "us-west-2" }),
	tableName = process.env.EMAIL_RATE_LIMIT_TABLE ?? productionTableName,
	currentTime = () => Date.now(),
): EmailRateLimiter => ({
	consume: async (identity) => {
		if (!tableName) throw new Error("EMAIL_RATE_LIMIT_TABLE is not configured");

		const now = currentTime();
		const window = Math.floor(now / (windowSeconds * 1_000));
		const identityHash = createHash("sha256").update(identity).digest("hex");
		const callerAllowed = await consumeBucket(
			client,
			tableName,
			`caller:${identityHash}:${window}`,
			requestsPerCallerWindow,
			now,
		);
		if (!callerAllowed) return false;

		return consumeBucket(
			client,
			tableName,
			`global:${window}`,
			requestsPerGlobalWindow,
			now,
		);
	},
});
