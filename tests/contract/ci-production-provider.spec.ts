import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import renovateConfiguration from "@/renovate.json" with { type: "json" };
import { extractYamlBlock } from "@/tests/support/yaml-block";

const ciWorkflow = readFileSync(
	new URL("../../.github/workflows/ci.yaml", import.meta.url),
	"utf8",
);
const infrastructureWorkflow = readFileSync(
	new URL("../../.github/workflows/infrastructure.yaml", import.meta.url),
	"utf8",
);
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
const operations = readFileSync(
	new URL("../../docs/operations.md", import.meta.url),
	"utf8",
);
const productionProviderConfig = readFileSync(
	new URL("../../vite.production-provider.config.ts", import.meta.url),
	"utf8",
);

test("runs semantic workflow and CloudFormation validation before deployment", () => {
	const validationJob = extractYamlBlock(
		ciWorkflow,
		"validate-infrastructure:",
	);
	const deployJob = extractYamlBlock(ciWorkflow, "deploy:");

	expect(validationJob).toContain(
		"go run github.com/rhysd/actionlint/cmd/actionlint@v1.7.7 .github/workflows/*.yaml",
	);
	expect(validationJob).toContain("python -m pip install cfn-lint==1.53.0");
	expect(validationJob).toContain(
		"cfn-lint infrastructure/cloudformation/*.yaml",
	);
	expect(deployJob).toContain("- validate-infrastructure");
});

test("pins production workflow actions and retains Renovate updates", () => {
	for (const workflow of [ciWorkflow, infrastructureWorkflow]) {
		const actionReferences = workflow
			.split("\n")
			.filter((line) => line.trimStart().startsWith("uses:"));
		expect(actionReferences.length).toBeGreaterThan(0);
		for (const reference of actionReferences) {
			expect(reference).toMatch(/uses: [^@\s]+@[0-9a-f]{40} # v\d+\.\d+\.\d+$/);
		}
	}

	expect(renovateConfiguration.extends).toContain("config:recommended");
});

test("persists and reports a protected last-known-good SHA only after smoke", () => {
	const smoke = extractYamlBlock(
		ciWorkflow,
		"- name: Run non-sending functional smoke tests",
	);
	const marker = extractYamlBlock(
		ciWorkflow,
		"- name: Persist last-known-good deployment SHA",
	);
	const failure = extractYamlBlock(
		ciWorkflow,
		"- name: Fail release validation",
	);
	const deploymentRole = extractYamlBlock(
		hostingTemplate,
		"RoutineDeploymentRole:",
	);
	const markerBoundary = extractYamlBlock(
		bootstrapTemplate,
		"- Sid: LastKnownGoodDeployment",
	);
	const parameterName = "/sarabeth-studio/production/last-known-good-sha";

	expect(smoke).toContain("id: functional_smoke");
	expect(marker).toContain(
		"if: steps.freshness.outputs.superseded == 'false' && steps.functional_smoke.outcome == 'success'",
	);
	expect(marker).toContain("id: last_known_good");
	expect(marker).toContain("aws ssm put-parameter");
	expect(marker).toContain('--value "$GITHUB_SHA"');
	expect(failure).toContain("steps.last_known_good.outcome == 'failure'");
	expect(failure).toContain("aws ssm get-parameter");
	expect(failure).toContain("Last-known-good deployment SHA: $validated_sha");
	for (const policy of [deploymentRole, markerBoundary]) {
		expect(policy).toContain("ssm:GetParameter");
		expect(policy).toContain("ssm:PutParameter");
		expect(policy).toContain(parameterName.slice(1));
		expect(policy).not.toContain("ssm:DeleteParameter");
	}
	expect(operations).toContain(`--name ${parameterName}`);
	expect(operations).toContain(
		"The live `__deployment.json` remains source attestation",
	);
});

test("bootstraps last-known-good state from a validated live deployment", () => {
	const bootstrap = operations.match(
		/### One-time last-known-good bootstrap[\s\S]*?```bash\n([\s\S]*?)```/,
	)?.[1];
	if (!bootstrap)
		throw new Error("Last-known-good bootstrap command is missing");

	expect(bootstrap).toContain("aws ssm get-parameter");
	expect(bootstrap).toContain("/__deployment.json");
	expect(bootstrap).toContain(
		'bun scripts/smoke-deployment.ts "$DEPLOYMENT_URL" "$current_sha"',
	);
	expect(bootstrap).toContain("aws ssm put-parameter");
	expect(bootstrap).not.toContain("--overwrite");
	expect(bootstrap.indexOf("scripts/smoke-deployment.ts")).toBeLessThan(
		bootstrap.indexOf("aws ssm put-parameter"),
	);
});

test("grants build-only access to the Contentful SSM parameter", () => {
	const serviceRole = extractYamlBlock(hostingTemplate, "AmplifyServiceRole:");
	const mainBranch = extractYamlBlock(hostingTemplate, "MainBranch:");
	const parameterBoundary = extractYamlBlock(
		bootstrapTemplate,
		"- Sid: ContentfulBuildParameter",
	);
	const hostingDeployment = extractYamlBlock(
		infrastructureWorkflow,
		"- name: Apply hosting stack",
	);
	const parameterName = "/sarabeth-studio/production/contentful/access-token";

	for (const policy of [serviceRole, parameterBoundary]) {
		expect(policy).toContain("ssm:GetParameter");
		expect(policy).not.toContain("ssm:PutParameter");
	}
	expect(serviceRole).toContain(
		`parameter\${ContentfulAccessTokenParameterName}`,
	);
	expect(parameterBoundary).toContain(parameterName.slice(1));
	expect(mainBranch).toContain("CONTENTFUL_SPACE_ID");
	expect(mainBranch).toContain("CONTENTFUL_ACCESS_TOKEN_PARAMETER");
	expect(infrastructureWorkflow).toContain(
		`CONTENTFUL_SPACE_ID: \${{ vars.CONTENTFUL_SPACE_ID }}`,
	);
	expect(hostingDeployment).toContain(
		'ContentfulSpaceId="$CONTENTFUL_SPACE_ID"',
	);
	for (const configuration of [hostingTemplate, bootstrapTemplate]) {
		expect(configuration).not.toContain("secretsmanager:");
		expect(configuration).not.toContain("ContentfulSecret");
	}
});

test("builds the production provider graph with only external boundaries replaced", () => {
	const buildStep = extractYamlBlock(
		ciWorkflow,
		"- name: Build production data-provider graph",
	);

	expect(buildStep).toContain("bun run build:production-provider");
	expect(productionProviderConfig).toContain(
		'"@/utils/contentful-entry-source.server"',
	);
	expect(productionProviderConfig).toContain('"@/utils/image.server"');
	expect(productionProviderConfig).not.toContain(
		'"@/utils/data-provider.server"',
	);
});
