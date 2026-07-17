import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

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
console.log(
	`Prepared Amplify bundle with ${prerenderedRoutes.length} static-first page routes`,
);
