import { execFile } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import publicRoutes from "@/scripts/public-routes.json" with { type: "json" };

const outputDirectory = ".amplify-hosting";
const manifestPath = join(outputDirectory, "deploy-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const assert: (condition: unknown, message: string) => asserts condition = (
	condition,
	message,
) => {
	if (!condition) throw new Error(message);
};

assert(manifest.version === 1, "Amplify deployment manifest must be version 1");
const deploymentMetadata = JSON.parse(
	await readFile(join(outputDirectory, "static", "__deployment.json"), "utf8"),
);
const { stdout: gitCommitOutput } = await promisify(execFile)("git", [
	"rev-parse",
	"HEAD",
]);
assert(
	deploymentMetadata.commit === gitCommitOutput.trim(),
	"Deployment metadata must identify the exact Git commit built by Amplify",
);
assert(
	manifest.computeResources?.length === 1,
	"Amplify bundle must contain one compute resource",
);
const computeResource = manifest.computeResources[0];
assert(
	computeResource.name === "default" &&
		computeResource.entrypoint === "server.js" &&
		computeResource.runtime === "nodejs24.x",
	"Amplify compute must use the default server.js entrypoint on nodejs24.x",
);

const staticAssetRouteIndex = manifest.routes.findIndex(
	(route: { path?: string }) => route.path === "/*.*",
);
const staticAssetRoute = manifest.routes[staticAssetRouteIndex];
assert(
	staticAssetRouteIndex >= 0 &&
		staticAssetRoute?.target?.kind === "Static" &&
		staticAssetRoute.fallback === undefined,
	"Static asset routing must not fall through to compute",
);
const deploymentMetadataRouteIndex = manifest.routes.findIndex(
	(route: { path?: string }) => route.path === "/__deployment.json",
);
const deploymentMetadataRoute = manifest.routes[deploymentMetadataRouteIndex];
assert(
	deploymentMetadataRouteIndex >= 0 &&
		deploymentMetadataRouteIndex < staticAssetRouteIndex &&
		deploymentMetadataRoute?.target?.kind === "Static" &&
		deploymentMetadataRoute.target.cacheControl === "no-store",
	"Deployment metadata must use a non-cached static route",
);
const apiRouteIndex = manifest.routes.findIndex(
	(route: { path?: string }) => route.path === "/api/email",
);
const apiRoute = manifest.routes[apiRouteIndex];
assert(
	apiRouteIndex >= 0 &&
		apiRoute?.target?.kind === "Compute" &&
		apiRoute.target.src === "default" &&
		apiRoute.fallback === undefined,
	"The email API must be the only compute route",
);
const catchAllRoute = manifest.routes.at(-1);
assert(
	catchAllRoute?.path === "/*" &&
		catchAllRoute.target?.kind === "Static" &&
		catchAllRoute.fallback === undefined,
	"Unmatched extensionless requests must return a static 404",
);
for (const route of manifest.routes) {
	if (route.path === "/api/email") continue;
	assert(
		route.target?.kind !== "Compute" && route.fallback?.kind !== "Compute",
		`Only /api/email may route to compute: ${route.path}`,
	);
}

const prerenderedPages = publicRoutes.map((path) => ({
	path,
	files:
		path === "/"
			? ["index.html"]
			: [`${path.slice(1)}.html`, `${path.slice(1)}/index.html`],
}));
for (const page of prerenderedPages) {
	const routeIndex = manifest.routes.findIndex(
		(route: { path?: string }) => route.path === page.path,
	);
	const route = manifest.routes[routeIndex];
	assert(
		routeIndex >= 0 &&
			routeIndex < staticAssetRouteIndex &&
			route?.target?.kind === "Static" &&
			route.fallback === undefined,
		`Prerendered page must use static-first routing: ${page.path}`,
	);
	for (const file of page.files) {
		assert(
			(await stat(join(outputDirectory, "static", file))).isFile(),
			`Missing prerendered page: ${file}`,
		);
	}
}

const staticCacheDirectory = join(
	outputDirectory,
	"static",
	"__tsr",
	"staticServerFnCache",
);
const staticCacheFiles = (await readdir(staticCacheDirectory)).filter((file) =>
	file.endsWith(".json"),
);
assert(
	staticCacheFiles.length > 0,
	"Amplify bundle must contain static server-function cache files",
);

const secretEnvironmentNames = [
	"CONTENTFUL_ACCESS_TOKEN",
	"AWS_ACCESS_KEY_ID",
	"AWS_SECRET_ACCESS_KEY",
	"AWS_SESSION_TOKEN",
	"AWS_SECRET",
] as const;
const artifactEntries = await readdir(outputDirectory, { recursive: true });
const artifactFiles: string[] = [];
for (const entry of artifactEntries) {
	const path = join(outputDirectory, entry);
	if ((await stat(path)).isFile()) artifactFiles.push(path);
}
for (const environmentName of secretEnvironmentNames) {
	const value = process.env[environmentName];
	if (!value) continue;
	const secret = Buffer.from(value);
	for (const file of artifactFiles) {
		if ((await readFile(file)).includes(secret)) {
			throw new Error(
				`Artifact contains the value of ${environmentName}: ${file}`,
			);
		}
	}
}

console.log(
	`Validated Amplify bundle: ${prerenderedPages.length} pages, ${staticCacheFiles.length} static server-function cache files, isolated email compute, and static 404 routing`,
);
