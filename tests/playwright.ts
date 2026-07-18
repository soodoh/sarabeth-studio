import { test as base, expect } from "@playwright/test";
import { installContentfulRoutes } from "@/tests/support/contentful-routes";

const fixedBrowserTime = new Date("2026-01-01T12:00:00.000Z");

const test = base.extend<{
	contentfulRoutes: undefined;
	fixedBrowserTime: undefined;
}>({
	fixedBrowserTime: [
		async ({ page }, use) => {
			await page.clock.install({ time: fixedBrowserTime });
			await use(undefined);
		},
		{ auto: true },
	],
	contentfulRoutes: [
		async ({ context }, use) => {
			await installContentfulRoutes(context);
			await use(undefined);
		},
		{ auto: true },
	],
});

export type { Locator, Page } from "@playwright/test";
export { expect, test };
