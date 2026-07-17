import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const manifestPath = join(".amplify-hosting", "deploy-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const prerenderedRoutes = [
	"/",
	"/about",
	"/contact",
	"/engagements",
	"/lessons",
	"/media",
];
const prerenderedRouteSet = new Set(prerenderedRoutes);
const remainingRoutes = manifest.routes.filter(
	(route: { path?: string }) => !prerenderedRouteSet.has(route.path ?? ""),
);
const computeFallback = { kind: "Compute", src: "default" };
manifest.routes = [
	...prerenderedRoutes.map((path) => ({
		path,
		target: { kind: "Static" },
		fallback: computeFallback,
	})),
	...remainingRoutes,
];

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
const run = promisify(execFile);
const { stdout } = await run("git", ["rev-parse", "HEAD"]);
const commit = stdout.trim();
await writeFile(
	join(".amplify-hosting", "static", "__deployment.json"),
	`${JSON.stringify({ commit })}\n`,
);
console.log(
	`Prepared Amplify bundle for ${commit} with ${prerenderedRoutes.length} static-first page routes`,
);
