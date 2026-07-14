import { type ChildProcess, spawn } from "node:child_process";

const forwardedEnvironment = [
	"CI",
	"HOME",
	"LANG",
	"LC_ALL",
	"PATH",
	"TMPDIR",
] as const;

const environment: NodeJS.ProcessEnv = {};
for (const key of forwardedEnvironment) {
	const value = process.env[key];
	if (value !== undefined) environment[key] = value;
}
const port = process.argv[2] ?? "3000";
environment.AWS_ACCESS = "playwright-disabled";
environment.AWS_SECRET = "playwright-disabled";
environment.CONTENTFUL_ACCESS_TOKEN = "playwright-disabled";
environment.CONTENTFUL_SPACE_ID = "playwright-disabled";
environment.HOST = "127.0.0.1";
environment.NODE_ENV = "production";
environment.PORT = port;

let child: ChildProcess | undefined;

const forwardSignal = (signal: NodeJS.Signals) => {
	child?.kill(signal);
};
process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

const run = (args: string[]): Promise<void> =>
	new Promise((resolve, reject) => {
		child = spawn("bun", ["--no-env-file", ...args], {
			env: environment,
			stdio: "inherit",
		});
		child.once("error", reject);
		child.once("exit", (code, signal) => {
			child = undefined;
			if (code === 0) resolve();
			else
				reject(
					new Error(`bun ${args.join(" ")} exited with ${signal ?? code}`),
				);
		});
	});

await run(["run", "build:playwright"]);
await run(["run", "start"]);
