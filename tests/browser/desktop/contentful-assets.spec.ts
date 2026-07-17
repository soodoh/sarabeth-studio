import { expect, test } from "@/tests/playwright";

test("renders production-shaped transformed Contentful image URLs", async ({
	page,
}) => {
	await page.goto("/about");
	const image = page.getByRole("img").first();
	const source = await image.getAttribute("src");
	const sourceSet = await image.getAttribute("srcset");
	expect(source).toMatch(/^https:\/\/images\.ctfassets\.net\//);
	expect(sourceSet).toContain("images.ctfassets.net");
	expect(sourceSet).toMatch(/[?&]w=\d+/);
	expect(sourceSet?.split(",").length).toBeGreaterThan(1);
	expect(await image.getAttribute("sizes")).toContain("30vw");
	await expect
		.poll(() =>
			image.evaluate(
				(element) =>
					element instanceof HTMLImageElement &&
					element.complete &&
					element.naturalWidth > 0,
			),
		)
		.toBe(true);
});

test("keeps audio on its Contentful URL without a production proxy", async ({
	page,
}) => {
	await page.goto("/media");
	const source = await page.locator("audio").first().getAttribute("src");
	expect(source).toMatch(/^https:\/\/assets\.ctfassets\.net\//);
	expect(source).not.toContain("/api/audio");
});
