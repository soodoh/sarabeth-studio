import { execFile } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
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
for (const path of prerenderedRoutes.filter((path) => path !== "/")) {
	const outputPath = join(".amplify-hosting", "static", path.slice(1));
	const html = await readFile(join(outputPath, "index.html"));
	await rm(outputPath, { recursive: true });
	await writeFile(`${outputPath}.html`, html);
}
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
