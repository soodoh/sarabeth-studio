import { spawnSync } from "node:child_process";
import {
	chmodSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { parse } from "yaml";
import { verifyAmplifySource } from "@/scripts/amplify-source-policy";

const repositoryRoot = dirname(
	dirname(dirname(fileURLToPath(import.meta.url))),
);
const verifierPath = fileURLToPath(
	new URL("../../scripts/verify-amplify-source.ts", import.meta.url),
);
const actualCommit = "b".repeat(40);
const differentCommit = "a".repeat(40);
const newerCommit = "c".repeat(40);
const fakeGitDirectory = mkdtempSync(join(tmpdir(), "amplify-verifier-git-"));
const fakeGitPath = join(fakeGitDirectory, "git");
writeFileSync(
	fakeGitPath,
	'#!/bin/sh\nif [ "$1" != "rev-parse" ] || [ "$2" != "HEAD" ]; then exit 2; fi\nprintf "%s\\n" "$FAKE_GIT_COMMIT"\n',
);
chmodSync(fakeGitPath, 0o755);

test.afterAll(() => {
	rmSync(fakeGitDirectory, { recursive: true, force: true });
});

const attestationUrl = (commit: string): string =>
	`data:application/json,${encodeURIComponent(JSON.stringify({ commit }))}`;

const runVerifier = (environment: Record<string, string | undefined>) =>
	spawnSync("bun", [verifierPath], {
		cwd: repositoryRoot,
		encoding: "utf8",
		env: {
			...process.env,
			AMPLIFY_ATTESTED_COMMIT_URL: undefined,
			AMPLIFY_JOB_COMMIT: undefined,
			AMPLIFY_JOB_TYPE: undefined,
			FAKE_GIT_COMMIT: actualCommit,
			PATH: `${fakeGitDirectory}${delimiter}${process.env.PATH ?? ""}`,
			...environment,
		},
	});

test("accepts the concrete CI-tested release source commit", () => {
	expect(verifyAmplifySource(actualCommit, "RELEASE", actualCommit)).toEqual({
		policy: "pinned",
		commit: actualCommit,
	});
});

test("rejects a different source selected by a release job", () => {
	expect(() =>
		verifyAmplifySource(differentCommit, "RELEASE", actualCommit),
	).toThrow(
		`Amplify checked out ${actualCommit}, expected job commit ${differentCommit}`,
	);
});

test("allows a movable webhook only for the CI-attested production commit", () => {
	expect(
		verifyAmplifySource("HEAD", "WEB_HOOK", actualCommit, actualCommit),
	).toEqual({ policy: "content-rebuild", commit: actualCommit });
	expect(() =>
		verifyAmplifySource("HEAD", "WEB_HOOK", actualCommit, differentCommit),
	).toThrow(
		`Amplify webhook checked out ${actualCommit}, but production attests ${differentCommit}`,
	);
	expect(() => verifyAmplifySource("HEAD", "WEB_HOOK", actualCommit)).toThrow(
		"Amplify webhook builds require a concrete CI-attested commit",
	);
	expect(() =>
		verifyAmplifySource("HEAD", "RELEASE", actualCommit, actualCommit),
	).toThrow("Amplify release jobs must report a concrete commit");
});

test("requires attestation for a webhook job that reports a concrete commit", () => {
	expect(
		verifyAmplifySource(actualCommit, "WEB_HOOK", actualCommit, actualCommit),
	).toEqual({
		policy: "content-rebuild",
		commit: actualCommit,
	});
	expect(() =>
		verifyAmplifySource(actualCommit, "WEB_HOOK", actualCommit),
	).toThrow("Amplify webhook builds require a concrete CI-attested commit");
});

test("rejects a newer concrete webhook commit than CI attested", () => {
	expect(() =>
		verifyAmplifySource(newerCommit, "WEB_HOOK", newerCommit, actualCommit),
	).toThrow(
		`Amplify webhook checked out ${newerCommit}, but production attests ${actualCommit}`,
	);
});

test("executes the real source verifier without repository Git metadata", () => {
	const success = runVerifier({
		AMPLIFY_JOB_COMMIT: actualCommit,
		AMPLIFY_JOB_TYPE: "RELEASE",
	});
	expect(success.status, success.stderr).toBe(0);
	expect(success.stdout).toContain(
		`Verified Amplify pinned source at ${actualCommit}`,
	);

	const mismatch = runVerifier({
		AMPLIFY_JOB_COMMIT: differentCommit,
		AMPLIFY_JOB_TYPE: "RELEASE",
	});
	expect(mismatch.status).not.toBe(0);
	expect(mismatch.stderr).toContain(
		`Amplify checked out ${actualCommit}, expected job commit ${differentCommit}`,
	);

	const newerWebhook = runVerifier({
		AMPLIFY_ATTESTED_COMMIT_URL: attestationUrl(actualCommit),
		AMPLIFY_JOB_COMMIT: newerCommit,
		AMPLIFY_JOB_TYPE: "WEB_HOOK",
		FAKE_GIT_COMMIT: newerCommit,
	});
	expect(newerWebhook.status).not.toBe(0);
	expect(newerWebhook.stderr).toContain(
		`Amplify webhook checked out ${newerCommit}, but production attests ${actualCommit}`,
	);

	const missing = runVerifier({ AMPLIFY_JOB_TYPE: "RELEASE" });
	expect(missing.status).not.toBe(0);
	expect(missing.stderr).toContain("AMPLIFY_JOB_COMMIT is required");
});

test("wires GetJob exports before the real verifier in Amplify preBuild", () => {
	const amplifyConfiguration = parse(
		readFileSync(new URL("../../amplify.yml", import.meta.url), "utf8"),
	);
	const commands = amplifyConfiguration.frontend.phases.preBuild.commands;
	expect(Array.isArray(commands)).toBe(true);
	const getJobIndex = commands.findIndex(
		(command: unknown) =>
			typeof command === "string" && command.includes("aws amplify get-job"),
	);
	const verifierIndex = commands.indexOf(
		"bun scripts/verify-amplify-source.ts",
	);
	const unsetIndex = commands.indexOf(
		"unset AMPLIFY_JOB_COMMIT AMPLIFY_JOB_TYPE",
	);

	expect(getJobIndex).toBeGreaterThan(-1);
	expect(commands[getJobIndex]).toContain("job.summary.[commitId,jobType]");
	expect(commands[getJobIndex]).toContain(
		"export AMPLIFY_JOB_COMMIT AMPLIFY_JOB_TYPE",
	);
	expect(verifierIndex).toBeGreaterThan(getJobIndex);
	expect(unsetIndex).toBeGreaterThan(verifierIndex);
});

for (const commit of ["", "None", "GitHub Actions release", "abc123"]) {
	test(`rejects the invalid Amplify release commit ${commit || "<empty>"}`, () => {
		expect(() => verifyAmplifySource(commit, "RELEASE", actualCommit)).toThrow(
			`Invalid Amplify job commit: ${commit}`,
		);
	});
}

for (const jobType of ["MANUAL", "RETRY", ""]) {
	test(`rejects the unsupported Amplify job type ${jobType || "<empty>"}`, () => {
		expect(() =>
			verifyAmplifySource(actualCommit, jobType, actualCommit),
		).toThrow(`Unsupported Amplify job type: ${jobType}`);
	});
}
