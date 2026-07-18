import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { extractYamlBlock } from "@/tests/support/yaml-block";

const hostingTemplate = readFileSync(
	new URL("../../infrastructure/cloudformation/hosting.yaml", import.meta.url),
	"utf8",
);
const bootstrapTemplate = readFileSync(
	new URL(
		"../../infrastructure/cloudformation/bootstrap.yaml",
		import.meta.url,
	),
	"utf8",
);

test("allows SES sends only from the contact sender to the intended recipient", () => {
	const computeRole = extractYamlBlock(hostingTemplate, "AmplifyComputeRole:");
	const workloadBoundary = extractYamlBlock(
		bootstrapTemplate,
		"- Sid: ContactEmail",
	);

	expect(computeRole).toContain("ses:FromAddress: contact@sarabethbelon.com");
	for (const policy of [computeRole, workloadBoundary]) {
		expect(policy).toContain("ForAllValues:StringEquals:");
		expect(policy).toContain("ses:Recipients: sarabethstudio@gmail.com");
	}
});

test("connects the durable pre-SES rate-limit boundary", () => {
	const table = extractYamlBlock(hostingTemplate, "EmailRateLimitTable:");
	const computeRole = extractYamlBlock(hostingTemplate, "AmplifyComputeRole:");
	const branch = extractYamlBlock(hostingTemplate, "MainBranch:");
	const workloadBoundary = extractYamlBlock(
		bootstrapTemplate,
		"- Sid: ContactEmailRateLimit",
	);

	expect(table).toContain("Type: AWS::DynamoDB::Table");
	expect(table).toContain("DeletionPolicy: Delete");
	expect(table).toContain("UpdateReplacePolicy: Delete");
	expect(table).toContain("TableName: sarabeth-contact-email-rate-limit");
	expect(computeRole).toContain(
		"Action: dynamodb:UpdateItem\n                Resource: !GetAtt EmailRateLimitTable.Arn",
	);
	expect(branch).toContain(
		"- Name: EMAIL_RATE_LIMIT_TABLE\n          Value: !Ref EmailRateLimitTable",
	);
	expect(workloadBoundary).toContain("Action: dynamodb:UpdateItem");
	expect(workloadBoundary).toContain(
		`Resource: !Sub arn:\${AWS::Partition}:dynamodb:\${AWS::Region}:\${AWS::AccountId}:table/sarabeth-contact-email-rate-limit`,
	);
});
