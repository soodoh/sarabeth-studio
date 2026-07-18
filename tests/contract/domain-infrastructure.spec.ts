import { spawnSync } from "node:child_process";
import {
	chmodSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { extractYamlBlock } from "@/tests/support/yaml-block";

const bootstrapTemplate = readFileSync(
	new URL(
		"../../infrastructure/cloudformation/bootstrap.yaml",
		import.meta.url,
	),
	"utf8",
);
const infrastructureWorkflow = readFileSync(
	new URL("../../.github/workflows/infrastructure.yaml", import.meta.url),
	"utf8",
);
const stackStateScript = new URL(
	"../../scripts/cloudformation-stack-state.sh",
	import.meta.url,
).pathname;

const runStackState = (
	scenario: "missing" | "throttled" | "denied" | "in-progress",
	operation: "status" | "settle" = "status",
	stackName = "sarabeth-amplify-domain",
) => {
	const directory = mkdtempSync(join(tmpdir(), "cloudformation-state-"));
	const log = join(directory, "aws.log");
	const state = join(directory, "state");
	writeFileSync(
		join(directory, "aws"),
		`#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$MOCK_AWS_LOG"
command_name=\${2:-}
if [[ "$command_name" == "cancel-update-stack" ]]; then
  exit 0
fi
count=0
[[ -f "$MOCK_AWS_STATE" ]] && count=$(cat "$MOCK_AWS_STATE")
printf '%s' "$((count + 1))" > "$MOCK_AWS_STATE"
case "$MOCK_SCENARIO" in
  missing)
    echo "An error occurred (ValidationError) when calling the DescribeStacks operation: Stack with id test does not exist" >&2
    exit 255
    ;;
  throttled)
    if ((count == 0)); then
      echo "An error occurred (ThrottlingException): Rate exceeded" >&2
      exit 255
    fi
    echo UPDATE_COMPLETE
    ;;
  denied)
    echo "An error occurred (AccessDenied) when calling the DescribeStacks operation: denied" >&2
    exit 255
    ;;
  in-progress)
    if ((count == 0)); then
      echo UPDATE_IN_PROGRESS
    elif ((count == 1)); then
      echo UPDATE_ROLLBACK_IN_PROGRESS
    else
      echo UPDATE_ROLLBACK_COMPLETE
    fi
    ;;
esac
`,
	);
	chmodSync(join(directory, "aws"), 0o755);
	const result = spawnSync(stackStateScript, [operation, stackName], {
		encoding: "utf8",
		env: {
			...process.env,
			PATH: `${directory}:${process.env.PATH ?? ""}`,
			MOCK_AWS_LOG: log,
			MOCK_AWS_STATE: state,
			MOCK_SCENARIO: scenario,
			CLOUDFORMATION_STATUS_RETRY_SECONDS: "0",
			CLOUDFORMATION_SETTLE_POLL_SECONDS: "0",
		},
	});
	const calls = readFileSync(log, "utf8").trim().split("\n");
	rmSync(directory, { force: true, recursive: true });
	return { result, calls };
};

test("scopes stack deletion to the failed domain stack", () => {
	const deploymentRole = extractYamlBlock(
		bootstrapTemplate,
		"InfrastructureDeploymentRole:",
	);
	const deletePolicy = extractYamlBlock(
		deploymentRole,
		"- Sid: DeleteFailedDomainStack",
	);

	expect(deletePolicy).toContain("Action: cloudformation:DeleteStack");
	expect(deletePolicy).toContain(
		`Resource: !Sub arn:\${AWS::Partition}:cloudformation:\${AWS::Region}:\${AWS::AccountId}:stack/sarabeth-amplify-domain/*`,
	);
	expect(
		bootstrapTemplate.match(/Action: cloudformation:DeleteStack/g),
	).toHaveLength(1);
});

test("keeps infrastructure credentials valid beyond the job timeout", () => {
	const deploymentRole = extractYamlBlock(
		bootstrapTemplate,
		"InfrastructureDeploymentRole:",
	);
	const job = extractYamlBlock(infrastructureWorkflow, "cloudformation:");
	const credentials = extractYamlBlock(
		infrastructureWorkflow,
		"- name: Configure protected infrastructure credentials",
	);

	expect(job).toContain("timeout-minutes: 230");
	expect(deploymentRole).toContain("MaxSessionDuration: 14400");
	expect(credentials).toContain("role-duration-seconds: 14400");
});

test("allows CloudFormation to update bounded role descriptions", () => {
	const executionRole = extractYamlBlock(
		bootstrapTemplate,
		"CloudFormationExecutionRole:",
	);
	const roleManagement = extractYamlBlock(
		executionRole,
		"- Sid: ManageBoundedWorkloadRoles",
	);

	expect(roleManagement).toContain("iam:UpdateRoleDescription");
});

test("restores Netlify DNS before removing the Amplify association", () => {
	const dnsStep = "- name: Apply DNS stack without changing delegation";
	const removalStep =
		"- name: Remove Amplify domain association after DNS rollback";
	const dns = extractYamlBlock(infrastructureWorkflow, dnsStep);
	const removal = extractYamlBlock(infrastructureWorkflow, removalStep);

	expect(dns).toContain("WebTarget=Netlify");
	expect(infrastructureWorkflow.indexOf(dnsStep)).toBeLessThan(
		infrastructureWorkflow.indexOf(removalStep),
	);
	expect(removal).toContain("AssociateDomain=false");
});

test("disables termination protection before deleting failed domain stacks", () => {
	for (const stepName of [
		"- name: Remove Amplify domain association after DNS rollback",
		"- name: Remove failed domain association after DNS rollback",
	]) {
		const cleanup = extractYamlBlock(infrastructureWorkflow, stepName);
		const disableIndex = cleanup.indexOf(
			"aws cloudformation update-termination-protection",
		);
		const deleteIndex = cleanup.indexOf("aws cloudformation delete-stack");

		expect(disableIndex).toBeGreaterThan(-1);
		expect(cleanup).toContain("--no-enable-termination-protection");
		expect(disableIndex).toBeLessThan(deleteIndex);
	}
});

test("allows cancellation only for timed-out domain and DNS updates", () => {
	const deploymentRole = extractYamlBlock(
		bootstrapTemplate,
		"InfrastructureDeploymentRole:",
	);
	const cancelPolicy = extractYamlBlock(
		deploymentRole,
		"- Sid: CancelTimedOutDomainOrDnsUpdate",
	);

	expect(cancelPolicy).toContain("Action: cloudformation:CancelUpdateStack");
	expect(cancelPolicy).toContain("stack/sarabeth-amplify-domain/*");
	expect(cancelPolicy).toContain("stack/sarabeth-amplify-dns/*");
	expect(
		bootstrapTemplate.match(/Action: cloudformation:CancelUpdateStack/g),
	).toHaveLength(1);
});

test("settles in-progress domain and DNS updates before recovery", () => {
	for (const stackName of ["sarabeth-amplify-domain", "sarabeth-amplify-dns"]) {
		const { result, calls } = runStackState("in-progress", "settle", stackName);
		expect(result.status, result.stderr).toBe(0);
		expect(calls).toContain(
			`cloudformation cancel-update-stack --stack-name ${stackName}`,
		);
		expect(calls.at(-1)).toContain(
			`cloudformation describe-stacks --stack-name ${stackName}`,
		);
	}
});

test("recognizes only missing stacks and retries throttled descriptions", () => {
	const missing = runStackState("missing");
	expect(missing.result.status, missing.result.stderr).toBe(0);
	expect(missing.result.stdout.trim()).toBe("NOT_FOUND");

	const throttled = runStackState("throttled");
	expect(throttled.result.status, throttled.result.stderr).toBe(0);
	expect(throttled.result.stdout.trim()).toBe("UPDATE_COMPLETE");
	expect(throttled.calls).toHaveLength(2);

	const denied = runStackState("denied");
	expect(denied.result.status).not.toBe(0);
	expect(denied.result.stderr).toContain("AccessDenied");
	expect(denied.result.stdout).not.toContain("NOT_FOUND");
});

test("validates domain dispatch inputs before production mutation", () => {
	const stepNames = infrastructureWorkflow
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.startsWith("- name:"));
	const templateValidation = stepNames.indexOf(
		"- name: Validate CloudFormation templates",
	);
	const operationValidation = stepNames.indexOf(
		"- name: Verify domain operation",
	);
	const hostingMutation = stepNames.indexOf("- name: Apply hosting stack");

	expect(templateValidation).toBeGreaterThanOrEqual(0);
	expect(operationValidation).toBe(templateValidation + 1);
	expect(hostingMutation).toBe(operationValidation + 1);
});

test("uses strict state handling in both domain cleanup paths", () => {
	for (const stepName of [
		"- name: Remove Amplify domain association after DNS rollback",
		"- name: Remove failed domain association after DNS rollback",
	]) {
		const cleanup = extractYamlBlock(infrastructureWorkflow, stepName);
		expect(cleanup).toContain("source scripts/cloudformation-stack-state.sh");
		expect(cleanup).toContain("settle_stack sarabeth-amplify-domain");
		expect(cleanup).toContain(
			"stack_status=$(get_stack_status sarabeth-amplify-domain)",
		);
		expect(cleanup).not.toContain("|| echo NOT_FOUND");
	}
});

test("settles DNS before either recovery deployment", () => {
	for (const stepName of [
		"- name: Apply DNS stack without changing delegation",
		"- name: Restore Netlify records after domain failure",
	]) {
		const recovery = extractYamlBlock(infrastructureWorkflow, stepName);
		expect(recovery).toContain("settle_stack sarabeth-amplify-dns");
		expect(recovery.indexOf("settle_stack")).toBeLessThan(
			recovery.indexOf("aws cloudformation deploy"),
		);
	}
});

test("does not protect the domain stack after cleanup fails", () => {
	const cleanup = extractYamlBlock(
		infrastructureWorkflow,
		"- name: Remove failed domain association after DNS rollback",
	);
	const terminationProtection = extractYamlBlock(
		infrastructureWorkflow,
		"- name: Preserve domain stack from accidental deletion",
	);

	expect(cleanup).toContain("id: domain_cleanup");
	expect(cleanup).toContain("continue-on-error: true");
	expect(terminationProtection).toContain(
		"if: (inputs.apply_domain || inputs.rollback_to_netlify) && steps.domain_cleanup.outcome != 'failure'",
	);
});
