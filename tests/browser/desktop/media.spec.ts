import { expect, type Locator, type Page, test } from "@/tests/playwright";
import { getContrastRatio } from "@/tests/support/contrast";

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
});

test("loads the video player only after explicit activation", async ({
	page,
}) => {
	const youtubeRequests: string[] = [];
	page.on("request", (request) => {
		if (request.url().startsWith("https://www.youtube.com/")) {
			youtubeRequests.push(request.url());
		}
	});
	await page.goto("/media");

	const loadPlaylist = page.getByRole("button", {
		name: "Load video playlist",
	});
	const player = page.getByTitle("YouTube video playlist");
	await expect(player).toHaveCount(0);
	expect(youtubeRequests).toEqual([]);
	await loadPlaylist.focus();
	await loadPlaylist.press("Enter");
	await expect(player).toBeVisible();
	await expect(player).toBeFocused();
	await expect.poll(() => youtubeRequests.length).toBeGreaterThan(0);
	await expect(
		page.getByRole("link", { name: "Open playlist on YouTube" }),
	).toHaveAttribute(
		"href",
		"https://www.youtube.com/playlist?list=PL2ucJM2n3hm_c0L7-_dAnJ_Kajde66Id1",
	);

	await page.getByRole("button", { name: "Play Let It Be Forgotten" }).focus();
	await page.keyboard.press("Shift+Tab");
	await expect(
		page.getByRole("link", { name: "Open playlist on YouTube" }),
	).toBeFocused();
	await page.keyboard.press("Shift+Tab");
	await expect(player).toBeFocused();
});

test("provides high-density photo candidates", async ({ page }) => {
	await page.goto("/media");
	const image = page
		.getByRole("region", { name: "Photo gallery" })
		.getByRole("img")
		.first();
	const box = await image.boundingBox();
	const sourceSet = await image.getAttribute("srcset");
	if (!box || !sourceSet) {
		throw new Error("The first gallery image must be visible and responsive");
	}
	const candidateWidths = sourceSet.split(",").flatMap((candidate) => {
		const width = candidate.trim().match(/ (\d+)w$/)?.[1];
		return width ? [Number(width)] : [];
	});
	const displayWidth = Math.round(box.width);

	expect(candidateWidths).toContain(displayWidth);
	expect(Math.max(...candidateWidths)).toBeGreaterThanOrEqual(displayWidth * 2);
});

test("mounts image content only near the selected carousel slide", async ({
	page,
}) => {
	await page.goto("/media");
	const gallery = page.getByRole("region", { name: "Photo gallery" });
	const images = gallery.locator("img");

	await expect(images).toHaveCount(2);
	await gallery.getByRole("button", { name: "Next slide" }).click();
	await expect(images).toHaveCount(3);
	await expectActiveImage(gallery, 2);
});

test("moves the photo carousel forwards and backwards with arrows", async ({
	page,
}) => {
	await page.goto("/media");
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
	await page.goto("/media");
	const gallery = page.getByRole("region", { name: "Photo gallery" });

	await dragGallery(page, gallery, "next");
	await expectActiveImage(gallery, 2);

	await dragGallery(page, gallery, "previous");
	await expectActiveImage(gallery, 1);
});

test("does not request audio until playback is requested", async ({ page }) => {
	const audioRequests: string[] = [];
	page.on("request", (request) => {
		if (request.url().endsWith("test-audio.wav")) {
			audioRequests.push(request.url());
		}
	});
	await page.goto("/media", { waitUntil: "networkidle" });
	const audioElements = page.locator("audio");
	const firstSource = await audioElements.first().getAttribute("src");
	const secondSource = await audioElements.nth(1).getAttribute("src");
	if (!firstSource || !secondSource) {
		throw new Error("Audio fixtures must provide two sources");
	}

	expect(audioRequests).toEqual([]);
	await audioElements
		.first()
		.locator("..")
		.getByRole("button", { name: "Play Let It Be Forgotten" })
		.click();
	await expect.poll(() => audioRequests).toContain(firstSource);
	expect(audioRequests).not.toContain(secondSource);
});

test("keeps the media page within a 320px viewport", async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 720 });
	await page.goto("/media");

	const dimensions = await page.evaluate(() => ({
		clientWidth: document.documentElement.clientWidth,
		scrollWidth: document.documentElement.scrollWidth,
	}));
	expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

test("names each recording and its controls distinctly", async ({ page }) => {
	await page.goto("/media");

	for (const title of ["Let It Be Forgotten", "Bereite dich Zion"]) {
		const player = page.getByRole("group", { name: `${title} audio player` });
		await expect(
			player.getByRole("button", { name: `Play ${title}` }),
		).toBeVisible();
		await expect(
			player.getByRole("slider", { name: `Seek ${title}` }),
		).toBeVisible();
	}
});

test("provides a usable seek target and visible keyboard focus", async ({
	page,
}) => {
	await page.goto("/media");
	const player = page.getByRole("group", {
		name: "Let It Be Forgotten audio player",
	});
	const playButton = player.getByRole("button", {
		name: "Play Let It Be Forgotten",
	});
	const seek = player.getByRole("slider", {
		name: "Seek Let It Be Forgotten",
	});
	const seekBox = await seek.boundingBox();
	if (!seekBox) throw new Error("Audio seek control is not visible");
	expect(seekBox.height).toBeGreaterThanOrEqual(24);

	await playButton.focus();
	await page.keyboard.press("Tab");
	await expect(seek).toBeFocused();
	await expect(seek).toHaveCSS("outline-style", "solid");
	await expect(seek).toHaveCSS("outline-width", "2px");
	await expect(seek).toHaveCSS("outline-color", "rgb(143, 56, 55)");
});

test("reports a media error emitted after playback begins", async ({
	page,
}) => {
	await page.goto("/media");
	const audio = page.locator("audio").first();
	const player = page.getByRole("group", {
		name: "Let It Be Forgotten audio player",
	});

	await player
		.getByRole("button", { name: "Play Let It Be Forgotten" })
		.click();
	await expect(
		player.getByRole("button", { name: "Pause Let It Be Forgotten" }),
	).toBeVisible();
	await audio.dispatchEvent("error");

	const alert = player.getByRole("alert");
	await expect(alert).toHaveText("Audio playback is unavailable.");
	expect(await getContrastRatio(alert)).toBeGreaterThanOrEqual(4.5);
	await expect(audio).toHaveJSProperty("paused", true);
	await expect(
		player.getByRole("button", { name: "Play Let It Be Forgotten" }),
	).toBeVisible();
});

test("reports failed audio playback without an unhandled page error", async ({
	page,
}) => {
	const pageErrors: string[] = [];
	page.on("pageerror", (error) => pageErrors.push(error.message));
	await page.goto("/media");
	const audio = page.locator("audio").first();
	const source = await audio.getAttribute("src");
	if (!source) throw new Error("Audio fixture must provide a source");
	await page.route(source, async (route) => route.abort("failed"));

	await audio
		.locator("..")
		.getByRole("button", { name: "Play Let It Be Forgotten" })
		.click();

	await expect(page.getByRole("alert")).toHaveText(
		"Audio playback is unavailable.",
	);
	await expect(audio).toHaveJSProperty("paused", true);
	await expect(
		audio
			.locator("..")
			.getByRole("button", { name: "Play Let It Be Forgotten" }),
	).toBeVisible();
	expect(pageErrors).toEqual([]);
});

test("plays, pauses, tracks, and seeks audio independently", async ({
	page,
}) => {
	await page.goto("/media");
	const audioElements = page.locator("audio");
	const firstAudio = audioElements.first();
	const firstPlayer = firstAudio.locator("..");
	const firstPlayButton = firstPlayer.getByRole("button", {
		name: "Play Let It Be Forgotten",
	});
	const secondPlayButton = audioElements
		.nth(1)
		.locator("..")
		.getByRole("button", { name: "Play Bereite dich Zion" });

	await expect(firstAudio).toHaveAttribute("preload", "none");
	await expect(firstPlayer).toContainText("00:00");

	await firstPlayButton.click();
	await expect
		.poll(() =>
			firstAudio.evaluate((audio: HTMLAudioElement) => audio.duration),
		)
		.toBeGreaterThan(0);
	await expect(
		firstPlayer.getByRole("button", { name: "Pause Let It Be Forgotten" }),
	).toBeVisible();
	await expect(secondPlayButton).toBeVisible();
	await expect
		.poll(() =>
			firstAudio.evaluate((audio: HTMLAudioElement) => audio.currentTime),
		)
		.toBeGreaterThan(0);

	await firstPlayer
		.getByRole("button", { name: "Pause Let It Be Forgotten" })
		.click();
	await expect(firstPlayButton).toBeVisible();
	await expect
		.poll(() => firstAudio.evaluate((audio: HTMLAudioElement) => audio.paused))
		.toBe(true);

	const seek = firstPlayer.getByRole("slider", {
		name: "Seek Let It Be Forgotten",
	});
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

	await seek.focus();
	await seek.press("Home");
	await expect
		.poll(() =>
			firstAudio.evaluate((audio: HTMLAudioElement) => audio.currentTime),
		)
		.toBeLessThan(0.1);
	await seek.press("End");
	await expect
		.poll(() =>
			firstAudio.evaluate(
				(audio: HTMLAudioElement) => audio.currentTime / audio.duration,
			),
		)
		.toBeGreaterThan(0.95);
});
