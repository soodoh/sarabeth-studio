import publicRoutes from "@/scripts/public-routes.json" with { type: "json" };

const deploymentUrl = process.argv[2]?.replace(/\/$/, "");
const expectedCommit = process.argv[3];
if (!deploymentUrl || !expectedCommit) {
	throw new Error(
		"Usage: bun scripts/smoke-deployment.ts <deployment-url> <expected-commit>",
	);
}

const request = async (path: string, init?: RequestInit): Promise<Response> => {
	const response = await fetch(`${deploymentUrl}${path}`, {
		...init,
		signal: AbortSignal.timeout(30_000),
		redirect: "manual",
	});
	return response;
};

const expectStatus = async (
	path: string,
	expectedStatus: number,
	init?: RequestInit,
): Promise<Response> => {
	const response = await request(path, init);
	if (response.status !== expectedStatus) {
		throw new Error(
			`${init?.method ?? "GET"} ${path}: expected ${expectedStatus}, received ${response.status}`,
		);
	}
	return response;
};

const deploymentMetadata = await expectStatus(
	`/__deployment.json?commit=${expectedCommit}`,
	200,
	{ headers: { "Cache-Control": "no-cache" } },
);
const deployedCommit = (await deploymentMetadata.json()).commit;
if (deployedCommit !== expectedCommit) {
	throw new Error(
		`Deployment metadata identifies ${deployedCommit}, expected ${expectedCommit}`,
	);
}

const publicPaths = publicRoutes.flatMap((route) =>
	route === "/" ? [route] : [route, `${route}/`],
);
let homeHtml = "";
for (const route of publicPaths) {
	const response = await expectStatus(route, 200);
	const contentType = response.headers.get("content-type") ?? "";
	if (!contentType.includes("text/html")) {
		throw new Error(
			`${route}: expected an HTML response, received ${contentType}`,
		);
	}
	if (
		response.headers.get("strict-transport-security") !== "max-age=31536000"
	) {
		throw new Error(`${route}: missing the production HSTS policy`);
	}
	if (response.headers.get("x-content-type-options") !== "nosniff") {
		throw new Error(`${route}: missing X-Content-Type-Options: nosniff`);
	}
	const body = await response.text();
	if (!body.includes("Sarabeth")) {
		throw new Error(`${route}: expected production page content was absent`);
	}
	if (route === "/") homeHtml = body;
}

for (const path of ["/robots.txt", "/sitemap.xml", "/deployment-smoke-404"]) {
	await expectStatus(path, 404);
}

const apiGet = await expectStatus("/api/email", 405);
if (apiGet.headers.get("allow") !== "POST") {
	throw new Error("GET /api/email: expected Allow: POST");
}

await expectStatus("/api/email", 415, {
	method: "POST",
	headers: { "Content-Type": "text/plain" },
	body: "non-sending smoke test",
});
await expectStatus("/api/email", 400, {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: "{",
});
await expectStatus("/api/email", 400, {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: "{}",
});
await expectStatus("/api/email", 413, {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ unexpected: "x".repeat(40_000) }),
});

const assetPaths = new Set(
	[...homeHtml.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)]
		.map((match) => match[1])
		.filter(
			(path) => path.startsWith("/assets/") || path.startsWith("/favicon"),
		),
);
if (assetPaths.size === 0) {
	throw new Error(
		"No same-origin static assets were discovered in the home page",
	);
}
for (const assetPath of assetPaths) {
	await expectStatus(assetPath, 200);
}

console.log(
	`Functional smoke passed for ${deploymentUrl} at ${expectedCommit}: ${publicPaths.length} page URLs, ${assetPaths.size} assets, 404 behavior, and non-sending email API checks`,
);
