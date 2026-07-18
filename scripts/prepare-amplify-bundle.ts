import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { createProductionRoutes } from "@/scripts/amplify-routing";
import publicRoutes from "@/scripts/public-routes.json" with { type: "json" };

const manifestPath = join(".amplify-hosting", "deploy-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
manifest.routes = createProductionRoutes(manifest.routes, publicRoutes);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
for (const path of publicRoutes.filter((path) => path !== "/")) {
	const outputPath = join(".amplify-hosting", "static", path.slice(1));
	const html = await readFile(join(outputPath, "index.html"));
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
	`Prepared Amplify bundle for ${commit} with ${publicRoutes.length} static-first page routes`,
);
