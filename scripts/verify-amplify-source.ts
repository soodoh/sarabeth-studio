import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { verifyAmplifySource } from "@/scripts/amplify-source-policy";

const requiredEnvironment = (name: string): string => {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
};

const getAttestedCommit = async (
	jobType: string,
): Promise<string | undefined> => {
	if (jobType !== "WEB_HOOK") return undefined;

	const metadataUrl =
		process.env.AMPLIFY_ATTESTED_COMMIT_URL ??
		`https://${requiredEnvironment("AWS_BRANCH")}.${requiredEnvironment("AWS_APP_ID")}.amplifyapp.com/__deployment.json`;
	const response = await fetch(metadataUrl, {
		headers: { "Cache-Control": "no-cache" },
	});
	if (!response.ok) {
		throw new Error(
			`Unable to read the CI-attested production commit: HTTP ${response.status}`,
		);
	}
	const metadata: unknown = await response.json();
	if (
		typeof metadata !== "object" ||
		metadata === null ||
		!("commit" in metadata) ||
		typeof metadata.commit !== "string"
	) {
		throw new Error("Production deployment metadata has no commit");
	}
	return metadata.commit;
};

const jobCommit = requiredEnvironment("AMPLIFY_JOB_COMMIT");
const jobType = requiredEnvironment("AMPLIFY_JOB_TYPE");
const { stdout } = await promisify(execFile)("git", ["rev-parse", "HEAD"]);
const actualCommit = stdout.trim();
const result = verifyAmplifySource(
	jobCommit,
	jobType,
	actualCommit,
	await getAttestedCommit(jobType),
);
console.log(`Verified Amplify ${result.policy} source at ${result.commit}`);
