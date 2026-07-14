import { expect, type Locator, type Page, test } from "@/tests/playwright";

const expectActiveImage = async (
	gallery: Locator,
	index: number,
): Promise<void> => {
	const slides = gallery.locator('[data-slot="carousel-item"]');
	const totalImages = await slides.count();
	const slide = slides.nth(index - 1);
	await expect(slide).toHaveAttribute(
		"aria-label",
		`${index} of ${totalImages}`,
	);
	await expect(slide).toHaveAttribute("aria-hidden", "false");
	await expect(slide.getByRole("img")).toBeInViewport();
	await expect(gallery.getByRole("status")).toHaveText(
		`${index} / ${totalImages}`,
	);
};

const dragGallery = async (
	page: Page,
	gallery: Locator,
	direction: "next" | "previous",
): Promise<void> => {
	const content = gallery.locator('[data-slot="carousel-content"]');
	const box = await content.boundingBox();
	if (!box) {
		throw new Error("Photo carousel is not visible");
	}

	const startRatio = direction === "next" ? 0.9 : 0.1;
	const endRatio = direction === "next" ? 0.1 : 0.9;
	const startX = box.x + box.width * startRatio;
	const endX = box.x + box.width * endRatio;
	const y = box.y + box.height / 2;

	await page.mouse.move(startX, y);
	await page.mouse.down();
	await page.mouse.move(endX, y, { steps: 12 });
	await page.mouse.up();
};

test.beforeEach(async ({ page }) => {
	await page.route("https://www.youtube.com/**", async (route) => {
		await route.fulfill({ body: "", contentType: "text/html" });
	});
	await page.goto("/media");
});

test("moves the photo carousel forwards and backwards with arrows", async ({
	page,
}) => {
	const gallery = page.getByRole("region", { name: "Photo gallery" });
	const previous = gallery.getByRole("button", { name: "Previous slide" });
	const next = gallery.getByRole("button", { name: "Next slide" });

	await expect(previous).toBeDisabled();
	await expect(next).toBeEnabled();
	await expectActiveImage(gallery, 1);

	await next.click();
	await expectActiveImage(gallery, 2);
	await expect(previous).toBeEnabled();

	await previous.click();
	await expectActiveImage(gallery, 1);
	await expect(previous).toBeDisabled();
});

test("moves the photo carousel forwards and backwards by dragging", async ({
	page,
}) => {
	const gallery = page.getByRole("region", { name: "Photo gallery" });

	await dragGallery(page, gallery, "next");
	await expectActiveImage(gallery, 2);

	await dragGallery(page, gallery, "previous");
	await expectActiveImage(gallery, 1);
});

test("plays, pauses, tracks, and seeks audio independently", async ({
	page,
}) => {
	const audioElements = page.locator("audio");
	const firstAudio = audioElements.first();
	const firstPlayer = firstAudio.locator("..");
	const firstPlayButton = firstPlayer.getByRole("button", {
		name: "Play audio",
	});
	const secondPlayButton = audioElements
		.nth(1)
		.locator("..")
		.getByRole("button", { name: "Play audio" });

	await expect
		.poll(() =>
			firstAudio.evaluate((audio: HTMLAudioElement) => audio.duration),
		)
		.toBeGreaterThan(0);
	await expect(firstPlayer).toContainText("00:00");

	await firstPlayButton.click();
	await expect(
		firstPlayer.getByRole("button", { name: "Pause audio" }),
	).toBeVisible();
	await expect(secondPlayButton).toBeVisible();
	await expect
		.poll(() =>
			firstAudio.evaluate((audio: HTMLAudioElement) => audio.currentTime),
		)
		.toBeGreaterThan(0);

	await firstPlayer.getByRole("button", { name: "Pause audio" }).click();
	await expect(firstPlayButton).toBeVisible();
	await expect
		.poll(() => firstAudio.evaluate((audio: HTMLAudioElement) => audio.paused))
		.toBe(true);

	const seek = firstPlayer.getByRole("button", { name: "Seek audio" });
	const seekBox = await seek.boundingBox();
	if (!seekBox) {
		throw new Error("Audio seek control is not visible");
	}
	await seek.click({
		position: { x: seekBox.width * 0.8, y: seekBox.height / 2 },
	});
	await expect
		.poll(() =>
			firstAudio.evaluate(
				(audio: HTMLAudioElement) => audio.currentTime / audio.duration,
			),
		)
		.toBeGreaterThan(0.75);
	await expect(firstPlayer).toContainText("00:03");
});
