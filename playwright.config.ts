import { defineConfig } from "@playwright/test";

const port = 3000;

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
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
			name: "desktop",
			use: {
				browserName: "chromium",
				viewport: { width: 1440, height: 900 },
			},
		},
		{
			name: "mobile",
			testIgnore: /functional\//,
			use: {
				browserName: "chromium",
				hasTouch: true,
				isMobile: true,
				viewport: { width: 390, height: 844 },
			},
		},
	],
	webServer: {
		command: `bun run build && bun run start --hostname 0.0.0.0 --port ${port}`,
		env: {
			...process.env,
			CONTENTFUL_USE_SNAPSHOT: "true",
			NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: "contentful-snapshot",
			NEXT_PUBLIC_CONTENTFUL_SPACE_ID: "contentful-snapshot",
			PLAYWRIGHT_TEST_DATE: "2026-01-01T12:00:00.000Z",
		},
		port,
		reuseExistingServer: false,
		timeout: 180_000,
	},
});
