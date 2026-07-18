import { defineConfig } from "@playwright/test";

const port = 3000;

const sharedBrowserTests = [
	"browser/shared/**/*.spec.ts",
	"visual/**/*.spec.ts",
];

export default defineConfig({
	testDir: "./tests",
	outputDir: "test-results",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	failOnFlakyTests: Boolean(process.env.CI),
	timeout: 45_000,
	workers: 2,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? "github" : "list",
	snapshotPathTemplate:
		"{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}",
	expect: {
		toHaveScreenshot: {
			animations: "disabled",
			caret: "hide",
			maxDiffPixelRatio: 0.001,
		},
	},
	use: {
		baseURL: `http://127.0.0.1:${port}`,
		colorScheme: "light",
		locale: "en-US",
		timezoneId: "America/Los_Angeles",
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "contract",
			testMatch: "contract/**/*.spec.ts",
		},
		{
			name: "desktop",
			testMatch: [...sharedBrowserTests, "browser/desktop/**/*.spec.ts"],
			use: {
				browserName: "chromium",
				viewport: { width: 1440, height: 900 },
			},
		},
		{
			name: "mobile",
			testMatch: sharedBrowserTests,
			use: {
				browserName: "chromium",
				hasTouch: true,
				isMobile: true,
				viewport: { width: 390, height: 844 },
			},
		},
	],
	webServer: {
		command: `bun --no-env-file scripts/playwright-server.ts ${port}`,
		port,
		reuseExistingServer: false,
		timeout: 180_000,
	},
});
