import { expect, type Page, test } from "@playwright/test";

const pages = [
	{ name: "home", path: "/" },
	{ name: "about", path: "/about" },
	{ name: "contact", path: "/contact" },
	{ name: "engagements", path: "/engagements" },
	{ name: "media", path: "/media" },
] as const;

const waitForHomeAnimations = async (page: Page): Promise<void> => {
	await page.evaluate(async () => {
		const nextFrame = async (): Promise<void> => {
			await new Promise<void>((resolve) =>
				requestAnimationFrame(() => resolve()),
			);
		};
		const pageBottom =
			document.documentElement.scrollHeight - window.innerHeight;
		const scrollStep = Math.max(window.innerHeight * 0.75, 1);

		for (
			let scrollPosition = 0;
			scrollPosition < pageBottom;
			scrollPosition += scrollStep
		) {
			window.scrollTo(0, scrollPosition);
			await nextFrame();
			await nextFrame();
		}
		window.scrollTo(0, pageBottom);
		await nextFrame();
		await nextFrame();

		await Promise.all(
			document.getAnimations().map(async (animation) => {
				try {
					await animation.finished;
				} catch {
					// A replaced animation is complete for screenshot purposes.
				}
			}),
		);
		window.scrollTo(0, 0);
	});

	await expect
		.poll(() =>
			page
				.locator('[style*="opacity"]')
				.evaluateAll((elements) =>
					elements.every(
						(element) => getComputedStyle(element).opacity === "1",
					),
				),
		)
		.toBe(true);
};

const preparePage = async (page: Page, path: string): Promise<void> => {
	await page.route("https://www.youtube.com/**", async (route) => {
		await route.fulfill({
			body: "<style>html,body{height:100%;margin:0;background:#000}</style>",
			contentType: "text/html",
		});
	});
	await page.goto(path, { waitUntil: "networkidle" });
	await page.evaluate(async () => {
		await document.fonts.ready;
		const images = [...document.images].filter(
			(image) => !image.closest('[aria-hidden="true"]'),
		);
		await Promise.all(
			images.map(async (image) => {
				if (!image.complete) {
					await new Promise<void>((resolve) => {
						image.addEventListener("load", () => resolve(), { once: true });
						image.addEventListener("error", () => resolve(), { once: true });
					});
				}
			}),
		);
	});
};

for (const pageDefinition of pages) {
	test(`${pageDefinition.name} page`, async ({ page }) => {
		await preparePage(page, pageDefinition.path);
		if (pageDefinition.name === "home") {
			await waitForHomeAnimations(page);
		}
		await expect(page).toHaveScreenshot(`${pageDefinition.name}.png`, {
			fullPage: true,
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
