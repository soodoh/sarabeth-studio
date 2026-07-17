import { expect, type Page, test } from "@/tests/playwright";

const pages = [
	{ name: "home", path: "/" },
	{ name: "about", path: "/about" },
	{ name: "contact", path: "/contact" },
	{ name: "engagements", path: "/engagements" },
	{ name: "media", path: "/media" },
] as const;

const waitForHomeAnimations = async (page: Page): Promise<void> => {
	const reveals = page.locator('[data-slot="home-reveal"]');
	for (let index = 0; index < (await reveals.count()); index += 1) {
		const reveal = reveals.nth(index);
		await reveal.scrollIntoViewIfNeeded();
		await expect(reveal).toHaveAttribute("style", /opacity:\s*1/);
		await expect(reveal).toHaveCSS("opacity", "1");
	}
	await reveals.evaluateAll((elements) => {
		for (const element of elements) {
			for (const animation of element.getAnimations()) {
				animation.cancel();
			}
		}
	});
	await page.addStyleTag({
		content: '[data-slot="home-reveal"] { opacity: 1 !important; }',
	});
	const viewport = page.viewportSize();
	if (!viewport) {
		throw new Error("Home visual test requires a viewport");
	}
	const fullHeight = await page.evaluate(
		() => document.documentElement.scrollHeight,
	);
	await page.setViewportSize({ width: viewport.width, height: fullHeight });
	await page.evaluate(() => window.scrollTo(0, 0));
};

const waitForImages = async (page: Page): Promise<void> => {
	await page.evaluate(async () => {
		const images = [...document.images].filter(
			(image) => !image.closest('[aria-hidden="true"]'),
		);
		await Promise.all(
			images.map(async (image) => {
				image.loading = "eager";
				try {
					await image.decode();
				} catch {
					throw new Error(`Image failed to decode: ${image.currentSrc}`);
				}
				if (!image.complete || image.naturalWidth === 0) {
					throw new Error(`Image failed to load: ${image.currentSrc}`);
				}
			}),
		);
	});
};

const preparePage = async (page: Page, path: string): Promise<void> => {
	await page.route("https://www.youtube.com/**", async (route) => {
		await route.fulfill({
			body: "<style>html,body{height:100%;margin:0;background:#000}</style>",
			contentType: "text/html",
		});
	});
	await page.goto(path, { waitUntil: "networkidle" });
	await page.evaluate(() => document.fonts.ready);
	await waitForImages(page);
};

for (const pageDefinition of pages) {
	test(`${pageDefinition.name} page`, async ({ page }) => {
		await preparePage(page, pageDefinition.path);
		if (pageDefinition.name === "home") {
			await waitForHomeAnimations(page);
			await waitForImages(page);
		}
		await expect(page).toHaveScreenshot(`${pageDefinition.name}.png`, {
			animations: pageDefinition.name === "home" ? "allow" : "disabled",
			fullPage: true,
			timeout: 15_000,
		});
	});
}

test.describe("lessons page", () => {
	test.beforeEach(async ({ page }) => {
		await preparePage(page, "/lessons");
	});

	for (const tab of ["About", "Studio", "Teaching Resume"] as const) {
		test(`${tab} tab`, async ({ page }) => {
			await page.getByRole("button", { name: tab, exact: true }).click();
			await expect(
				page.getByRole("button", { name: tab, exact: true }),
			).toHaveClass(/bg-accent/);
			await expect(page).toHaveScreenshot(
				`lessons-${tab.toLowerCase().replaceAll(" ", "-")}.png`,
				{ fullPage: true },
			);
		});
	}
});
