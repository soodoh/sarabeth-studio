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
import publicRoutes from "@/scripts/public-routes.json" with { type: "json" };
import { extractYamlBlock } from "@/tests/support/yaml-block";

const hostingTemplate = readFileSync(
	new URL("../../infrastructure/cloudformation/hosting.yaml", import.meta.url),
	"utf8",
);
const infrastructureWorkflow = readFileSync(
	new URL("../../.github/workflows/infrastructure.yaml", import.meta.url),
	"utf8",
);
const redirectScript = new URL(
	"../../scripts/validate-canonical-redirects.sh",
	import.meta.url,
).pathname;

const createRedirectMocks = (): { directory: string; log: string } => {
	const directory = mkdtempSync(join(tmpdir(), "redirect-validation-"));
	const log = join(directory, "curl.log");
	writeFileSync(
		join(directory, "aws"),
		`#!/usr/bin/env bash
case "\${MOCK_AWS_SCENARIO:-available}" in
  available)
    echo AVAILABLE
    ;;
  unavailable)
    echo PENDING_VERIFICATION
    ;;
  not-found)
    echo "An error occurred (NotFoundException) when calling the GetDomainAssociation operation: Domain not found" >&2
    exit 255
    ;;
  denied)
    echo "An error occurred (AccessDeniedException) when calling the GetDomainAssociation operation: Access denied" >&2
    exit 254
    ;;
esac
`,
	);
	writeFileSync(
		join(directory, "curl"),
		`#!/usr/bin/env bash
set -euo pipefail
headers=''
url=''
while (($#)); do
  case "$1" in
    --dump-header)
      headers=$2
      shift 2
      ;;
    https://*)
      url=$1
      shift
      ;;
    *)
      shift
      ;;
  esac
done
printf '%s\n' "$url" >> "$MOCK_CURL_LOG"
location=$(printf '%s' "$url" | sed 's#https://www\\.#https://#')
if [[ "$MOCK_REDIRECT_MODE" == "valid" ]]; then
  printf 'HTTP/1.1 301 Moved Permanently\nLocation: %s\n' "$location" > "$headers"
  printf '301'
else
  printf 'HTTP/1.1 302 Found\nLocation: https://example.com/\n' > "$headers"
  printf '302'
fi
`,
	);
	chmodSync(join(directory, "aws"), 0o755);
	chmodSync(join(directory, "curl"), 0o755);
	return { directory, log };
};

type AwsScenario = "available" | "unavailable" | "not-found" | "denied";

const runRedirectValidation = (
	directory: string,
	log: string,
	mode: "valid" | "invalid",
	timeoutSeconds: string,
	options: { awsScenario?: AwsScenario; skipUnavailable?: boolean } = {},
) =>
	spawnSync(
		redirectScript,
		[
			"test-app",
			"test-run",
			...(options.skipUnavailable ? ["--skip-unavailable"] : []),
		],
		{
			encoding: "utf8",
			env: {
				...process.env,
				PATH: `${directory}:${process.env.PATH ?? ""}`,
				MOCK_AWS_SCENARIO: options.awsScenario ?? "available",
				MOCK_CURL_LOG: log,
				MOCK_REDIRECT_MODE: mode,
				REDIRECT_VALIDATION_RETRY_SECONDS: "1",
				REDIRECT_VALIDATION_TIMEOUT_SECONDS: timeoutSeconds,
			},
		},
	);

test("the exact canonical domain redirect runs before every static route rewrite", () => {
	const canonicalRedirect = [
		"        - Source: https://www.sarabethbelon.com",
		"          Target: https://sarabethbelon.com",
		'          Status: "301"',
	].join("\n");
	const canonicalRedirectIndex = hostingTemplate.indexOf(canonicalRedirect);

	expect(canonicalRedirectIndex).toBeGreaterThan(-1);
	for (const route of publicRoutes.filter((route) => route !== "/")) {
		const rewrite = [
			`        - Source: ${route}`,
			`          Target: ${route}.html`,
			'          Status: "200"',
		].join("\n");
		expect(hostingTemplate.indexOf(rewrite)).toBeGreaterThan(
			canonicalRedirectIndex,
		);
	}
});

test("validates every canonical redirect with mocked AWS and HTTP", () => {
	const { directory, log } = createRedirectMocks();
	try {
		const result = runRedirectValidation(directory, log, "valid", "10");
		expect(result.status, result.stderr).toBe(0);
		const requestedUrls = readFileSync(log, "utf8").trim().split("\n");
		expect(requestedUrls).toEqual(
			publicRoutes.map((route) => {
				const path = route === "/" ? "/" : route;
				return `https://www.sarabethbelon.com${path}?redirect-check=test-run`;
			}),
		);
	} finally {
		rmSync(directory, { force: true, recursive: true });
	}
});

test("skips only unavailable or missing domains and propagates access failures", () => {
	const { directory, log } = createRedirectMocks();
	try {
		for (const awsScenario of ["unavailable", "not-found"] as const) {
			const skipped = runRedirectValidation(directory, log, "valid", "10", {
				awsScenario,
				skipUnavailable: true,
			});
			expect(skipped.status, skipped.stderr).toBe(0);
			expect(skipped.stdout).toContain(
				"Skipping canonical redirect validation",
			);
		}

		const denied = runRedirectValidation(directory, log, "valid", "10", {
			awsScenario: "denied",
			skipUnavailable: true,
		});
		expect(denied.status).toBe(254);
		expect(denied.stderr).toContain("AccessDeniedException");
		expect(denied.stdout).not.toContain(
			"Skipping canonical redirect validation",
		);
	} finally {
		rmSync(directory, { force: true, recursive: true });
	}
});

test("bounds redirect failure and routes activation failures to rollback", () => {
	const { directory, log } = createRedirectMocks();
	try {
		const result = runRedirectValidation(directory, log, "invalid", "1");
		expect(result.status).toBe(1);
		expect(result.stderr).toContain(
			"Canonical www redirects did not stabilize within 1s",
		);
	} finally {
		rmSync(directory, { force: true, recursive: true });
	}

	const job = extractYamlBlock(infrastructureWorkflow, "cloudformation:");
	const association = extractYamlBlock(
		infrastructureWorkflow,
		"- name: Apply approval-gated domain association and DNS",
	);
	const validation = extractYamlBlock(
		infrastructureWorkflow,
		"- name: Validate canonical www redirects after activation",
	);
	const rollback = extractYamlBlock(
		infrastructureWorkflow,
		"- name: Restore Netlify records after domain failure",
	);
	const cleanup = extractYamlBlock(
		infrastructureWorkflow,
		"- name: Remove failed domain association after DNS rollback",
	);

	expect(job).toContain("timeout-minutes: 230");
	expect(association).toContain("continue-on-error: true");
	expect(association).toContain("timeout-minutes: 120");
	expect(association).not.toContain("timeout 20m");
	expect(association.match(/aws cloudformation deploy/g)).toHaveLength(2);
	expect(validation).toContain("continue-on-error: true");
	expect(validation).toContain("timeout-minutes: 10");
	for (const step of [rollback, cleanup]) {
		expect(step).toContain("steps.domain_association.outcome == 'failure'");
		expect(step).toContain("steps.canonical_redirects.outcome == 'failure'");
	}
	expect(rollback).toContain("timeout-minutes: 15");
	expect(cleanup).toContain("timeout-minutes: 20");
});
