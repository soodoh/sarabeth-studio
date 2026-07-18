import { expect, test } from "@/tests/playwright";
import { installContentfulRoutes } from "@/tests/support/contentful-routes";

const selectedImageWidth = (source: string): number => {
	const width = new URL(source).searchParams.get("w");
	if (!width) throw new Error(`Responsive image URL has no width: ${source}`);
	return Number(width);
};

test("keeps every home reveal visible without JavaScript", async ({
	browser,
}) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 1440, height: 900 },
	});
	await installContentfulRoutes(context);
	try {
		const page = await context.newPage();
		await page.goto("http://127.0.0.1:3000/");
		const reveals = page.locator('[data-slot="home-reveal"]');
		expect(await reveals.count()).toBeGreaterThan(1);
		for (const reveal of await reveals.all()) {
			await expect(reveal).toBeVisible();
			await expect(reveal).toHaveCSS("opacity", "1");
		}
	} finally {
		await context.close();
	}
});

test("keeps every home reveal visible when application JavaScript fails", async ({
	page,
}) => {
	await page.route("**/*.js", async (route) => route.abort("blockedbyclient"));
	await page.goto("/");

	await expect(page.locator("html")).toHaveClass(/\bjs-pending\b/);
	await expect(page.locator("html")).not.toHaveClass(/(?:^|\s)js(?:\s|$)/);
	const reveals = page.locator('[data-slot="home-reveal"]');
	expect(await reveals.count()).toBeGreaterThan(1);
	for (const reveal of await reveals.all()) {
		await expect(reveal).toBeVisible();
		await expect(reveal).toHaveCSS("opacity", "1");
	}
});

test("selects container-sized priority portraits at desktop DPR 1 and 2", async ({
	browser,
	page,
}) => {
	await page.goto("/");
	const priorityImage = page.locator('[data-slot="home-reveal"] img').first();
	await expect(priorityImage).toBeVisible();
	const dprOneSource = await priorityImage.evaluate(
		(image: HTMLImageElement) => image.currentSrc,
	);
	expect(selectedImageWidth(dprOneSource)).toBeLessThanOrEqual(750);

	const highDensityContext = await browser.newContext({
		deviceScaleFactor: 2,
		viewport: { width: 1440, height: 900 },
	});
	await installContentfulRoutes(highDensityContext);
	const highDensityPage = await highDensityContext.newPage();
	await highDensityPage.goto("http://127.0.0.1:3000/");
	const highDensityImage = highDensityPage
		.locator('[data-slot="home-reveal"] img')
		.first();
	await expect(highDensityImage).toBeVisible();
	const dprTwoSource = await highDensityImage.evaluate(
		(image: HTMLImageElement) => image.currentSrc,
	);
	expect(selectedImageWidth(dprTwoSource)).toBe(1280);
	await highDensityContext.close();
});

test("selects a DPR-2 priority image that matches the stacked 650px layout", async ({
	browser,
}) => {
	const context = await browser.newContext({
		deviceScaleFactor: 2,
		viewport: { width: 650, height: 900 },
	});
	await installContentfulRoutes(context);
	try {
		const page = await context.newPage();
		await page.goto("http://127.0.0.1:3000/");
		const priorityImage = page.locator('[data-slot="home-reveal"] img').first();
		await expect(priorityImage).toBeVisible();
		const imageMetrics = await priorityImage.evaluate(
			(image: HTMLImageElement) => ({
				displayWidth: image.getBoundingClientRect().width,
				source: image.currentSrc,
			}),
		);

		expect(imageMetrics.displayWidth).toBeGreaterThan(500);
		expect(selectedImageWidth(imageMetrics.source)).toBeGreaterThanOrEqual(
			imageMetrics.displayWidth * 2,
		);
	} finally {
		await context.close();
	}
});

test("reveals the Read Bio CTA immediately and navigates client-side", async ({
	page,
}) => {
	await page.goto("/");
	const readBio = page.getByRole("link", { name: "Read Bio" });
	const reveal = readBio.locator("..");
	await reveal.evaluate((element) => {
		delete element.dataset.visible;
		delete element.dataset.focusRevealed;
	});
	await expect(reveal).toHaveCSS("opacity", "0");

	let documentRequests = 0;
	page.on("request", (request) => {
		if (request.resourceType() === "document") documentRequests += 1;
	});
	await readBio.focus();
	await expect(readBio).toBeFocused();
	await expect(reveal).toHaveCSS("opacity", "1");
	await expect(reveal).toHaveCSS("transition-duration", "0s");
	await readBio.click();

	await expect(page).toHaveURL(/\/about$/);
	expect(documentRequests).toBe(0);
});

test("shows reveal content when reduced motion is requested", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	for (const reveal of await page.locator('[data-slot="home-reveal"]').all()) {
		await expect(reveal).toHaveCSS("opacity", "1");
	}
});
