import { test as base, expect } from "@playwright/test";
import { installContentfulRoutes } from "@/tests/support/contentful-routes";

const test = base.extend<{ contentfulRoutes: undefined }>({
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
