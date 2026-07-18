const commitPattern = /^[0-9a-f]{40}$/;

export const verifyAmplifySource = (
	jobCommit: string,
	jobType: string,
	actualCommit: string,
	attestedCommit?: string,
): { policy: "pinned" | "content-rebuild"; commit: string } => {
	if (jobType !== "RELEASE" && jobType !== "WEB_HOOK") {
		throw new Error(`Unsupported Amplify job type: ${jobType}`);
	}
	if (jobType === "RELEASE") {
		if (jobCommit === "HEAD") {
			throw new Error("Amplify release jobs must report a concrete commit");
		}
		if (!commitPattern.test(jobCommit)) {
			throw new Error(`Invalid Amplify job commit: ${jobCommit}`);
		}
		if (actualCommit !== jobCommit) {
			throw new Error(
				`Amplify checked out ${actualCommit}, expected job commit ${jobCommit}`,
			);
		}
		return { policy: "pinned", commit: actualCommit };
	}

	if (jobCommit !== "HEAD" && !commitPattern.test(jobCommit)) {
		throw new Error(`Invalid Amplify job commit: ${jobCommit}`);
	}
	if (!attestedCommit || !commitPattern.test(attestedCommit)) {
		throw new Error(
			"Amplify webhook builds require a concrete CI-attested commit",
		);
	}
	if (actualCommit !== attestedCommit) {
		throw new Error(
			`Amplify webhook checked out ${actualCommit}, but production attests ${attestedCommit}`,
		);
	}
	if (jobCommit !== "HEAD" && actualCommit !== jobCommit) {
		throw new Error(
			`Amplify checked out ${actualCommit}, expected job commit ${jobCommit}`,
		);
	}
	return { policy: "content-rebuild", commit: actualCommit };
};
