import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const hostingTemplate = readFileSync(
	new URL("../../infrastructure/cloudformation/hosting.yaml", import.meta.url),
	"utf8",
);

test("the canonical domain redirect runs before static route rewrites", () => {
	const canonicalRedirect = "        - Source: https://www.sarabethbelon.com\n";
	const canonicalRedirectIndex = hostingTemplate.indexOf(canonicalRedirect);

	expect(canonicalRedirectIndex).toBeGreaterThan(-1);
	for (const route of [
		"/about",
		"/contact",
		"/engagements",
		"/lessons",
		"/media",
	]) {
		const staticRewriteIndex = hostingTemplate.indexOf(
			`        - Source: ${route}\n`,
		);
		expect(staticRewriteIndex).toBeGreaterThan(canonicalRedirectIndex);
	}
});
