import { expect, type Page, test } from "@/tests/playwright";
import { getContrastRatio } from "@/tests/support/contrast";
import { emailFieldLimits } from "@/utils/email";

test("hydrates and performs client-side header navigation", async ({
	page,
}) => {
	await page.goto("/");
	let documentNavigations = 0;
	const dataRequests: string[] = [];
	page.on("request", (request) => {
		const pathname = new URL(request.url()).pathname;
		if (
			pathname.includes("/_serverFn") ||
			pathname.startsWith("/__tsr/staticServerFnCache/")
		) {
			dataRequests.push(pathname);
		}
		if (
			request.isNavigationRequest() &&
			request.resourceType() === "document"
		) {
			documentNavigations += 1;
		}
	});

	if (await page.getByRole("button", { name: "Open Navigation" }).isVisible()) {
		const menuButton = page.getByRole("button", { name: "Open Navigation" });
		await menuButton.focus();
		await menuButton.press("Enter");
	}
	await page.getByRole("link", { name: "About", exact: true }).click();
	await expect(page).toHaveURL(/\/about$/);
	await expect(
		page.getByRole("heading", { name: "Sarabeth Belón" }),
	).toBeVisible();
	expect(documentNavigations).toBe(0);
	expect(
		dataRequests.some((pathname) =>
			pathname.startsWith("/__tsr/staticServerFnCache/"),
		),
	).toBe(true);
	expect(dataRequests.some((pathname) => pathname.includes("/_serverFn"))).toBe(
		false,
	);
	const staticCachePath = dataRequests.find((pathname) =>
		pathname.startsWith("/__tsr/staticServerFnCache/"),
	);
	if (staticCachePath === undefined) {
		throw new Error("Client navigation did not request static server data");
	}
	const unsupportedCacheRequest = await page.request.post(staticCachePath);
	expect(unsupportedCacheRequest.status()).toBe(405);
	expect(unsupportedCacheRequest.headers().allow).toBe("GET, HEAD");
	await expect(
		page.getByRole("button", { name: "Close Navigation" }),
	).toBeHidden();
});

test("rejects unsupported email endpoint methods", async ({ request }) => {
	const response = await request.get("/api/email");

	expect(response.status()).toBe(405);
	expect(response.headers().allow).toBe("POST");
	expect(await response.body()).toHaveLength(0);
});

test("rejects unsupported YouTube playlist endpoint methods", async ({
	request,
}) => {
	const response = await request.post("/api/youtube-playlist");

	expect(response.status()).toBe(405);
	expect(response.headers().allow).toBe("GET");
	expect(response.headers()["cache-control"]).toBe("no-store");
});

test("publishes the approved YouTube privacy disclosure", async ({ page }) => {
	await page.goto("/privacy");

	await expect(
		page.getByRole("heading", { name: "Privacy Policy" }),
	).toBeVisible();
	await expect(page.getByText("Effective July 19, 2026")).toBeVisible();
	await expect(
		page.getByRole("link", { name: "YouTube Terms of Service" }),
	).toHaveAttribute("href", "https://www.youtube.com/t/terms");
	await expect(
		page.getByRole("link", { name: "Google Privacy Policy" }),
	).toHaveAttribute("href", "https://policies.google.com/privacy");
	await expect(
		page.getByRole("link", { name: "Privacy", exact: true }),
	).toHaveAttribute("href", "/privacy");
});

test("serves the icons declared by the web manifest", async ({ request }) => {
	const manifestResponse = await request.get("/favicon/site.webmanifest");
	expect(manifestResponse.status()).toBe(200);
	const manifest: unknown = await manifestResponse.json();
	if (
		!manifest ||
		typeof manifest !== "object" ||
		!("icons" in manifest) ||
		!Array.isArray(manifest.icons)
	) {
		throw new Error("Web manifest must declare an icons array");
	}

	for (const icon of manifest.icons) {
		if (!icon || typeof icon !== "object" || !("src" in icon)) {
			throw new Error("Every manifest icon must declare a source");
		}
		if (typeof icon.src !== "string") {
			throw new Error("Manifest icon sources must be strings");
		}
		const response = await request.get(icon.src);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain("image/png");
	}
});

const fillContactForm = async (page: Page): Promise<void> => {
	await page.getByLabel("Name").fill("Test Singer");
	await page.getByLabel("Email").fill("singer@example.com");
	await page.getByLabel("Subject").fill("Lessons");
	await page.getByLabel("Message").fill("I would like more information.");
};

test("keeps submitted contact errors at normal-text contrast", async ({
	page,
}) => {
	await page.goto("/contact");
	await page.getByRole("button", { name: "Submit" }).click();
	await expect(page.getByRole("alert")).toHaveCount(4);

	for (const label of ["Name", "Email", "Subject", "Message"]) {
		const field = page.getByLabel(label);
		expect(
			await getContrastRatio(page.locator(`label[for="${label}"]`)),
		).toBeGreaterThanOrEqual(4.5);
		expect(
			await getContrastRatio(page.locator(`#${label}-error`)),
		).toBeGreaterThanOrEqual(4.5);
		await expect(field).toHaveClass(/!border-red-600/);
	}
});

test("normalizes modern CSS colors and composites alpha for contrast", async ({
	page,
}) => {
	await page.goto("/contact");
	await page.evaluate(() => {
		const sample = document.createElement("span");
		sample.id = "contrast-color-sample";
		sample.style.color = "oklch(0 0 0 / 50%)";
		sample.textContent = "Contrast sample";
		document.body.append(sample);
	});

	const ratio = await getContrastRatio(page.locator("#contrast-color-sample"));
	expect(ratio).toBeGreaterThan(3.7);
	expect(ratio).toBeLessThan(3.8);
});

test("keeps dark accent surfaces at normal-text contrast", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/contact");
	const bannerTitle = page.getByRole("heading", { name: "Contact Sarabeth" });
	expect(await getContrastRatio(bannerTitle)).toBeGreaterThanOrEqual(4.5);

	const submit = page.getByRole("button", { name: "Submit" });
	await submit.hover();
	expect(await getContrastRatio(submit)).toBeGreaterThanOrEqual(4.5);
});

test("disables sheet motion when reduced motion is requested", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	await page.getByRole("button", { name: "Open Navigation" }).click();

	const overlay = page.locator('[data-slot="sheet-overlay"]');
	const content = page.locator('[data-slot="sheet-content"]');
	await expect(overlay).toBeVisible();
	await expect(overlay).toHaveCSS("animation-name", "none");
	await expect(content).toHaveCSS("animation-name", "none");
	await expect(content).toHaveCSS("transition-property", "none");
});

test("stops the loading indicator when reduced motion is requested", async ({
	page,
}) => {
	let finishResponse = (): void => {};
	const responseGate = new Promise<void>((resolve) => {
		finishResponse = resolve;
	});
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.route("**/api/email", async (route) => {
		await responseGate;
		await route.fulfill({ status: 200, json: { success: true } });
	});
	await page.goto("/contact");
	await fillContactForm(page);
	await page.getByRole("button", { name: "Submit" }).click();

	const loadingCircle = page.locator('[data-slot="loading-circle"] circle');
	await expect(loadingCircle).toBeVisible();
	await expect(loadingCircle).toHaveCSS("animation-name", "none");
	finishResponse();
	await expect(
		page.getByRole("heading", { name: "Message successfully sent!" }),
	).toBeVisible();
});

test("submits the hydrated contact form to the email endpoint", async ({
	page,
}) => {
	let requestBody: unknown;
	let contentType: string | undefined;
	let finishResponse = (): void => {};
	const responseGate = new Promise<void>((resolve) => {
		finishResponse = resolve;
	});
	await page.route("**/api/email", async (route) => {
		requestBody = route.request().postDataJSON();
		contentType = route.request().headers()["content-type"];
		await responseGate;
		await route.fulfill({ status: 200, json: { success: true } });
	});
	await page.goto("/contact");
	await fillContactForm(page);
	const submitButton = page.getByRole("button", { name: "Submit" });
	await submitButton.click();
	await expect(submitButton).toBeDisabled();
	await expect(submitButton).toHaveAttribute("aria-busy", "true");
	await expect(page.getByRole("status")).toContainText("Sending message");
	finishResponse();
	await expect(
		page.getByRole("heading", { name: "Message successfully sent!" }),
	).toBeVisible();
	await expect(page.getByRole("status")).toBeFocused();
	expect(contentType).toBe("application/json");
	expect(requestBody).toEqual({
		name: "Test Singer",
		email: "singer@example.com",
		subject: "Lessons",
		message: "I would like more information.",
	});
});

test("restores the contact form after a network failure", async ({ page }) => {
	await page.route("**/api/email", async (route) => {
		await route.abort("failed");
	});
	await page.goto("/contact");
	await fillContactForm(page);
	await page.getByRole("button", { name: "Submit" }).click();

	await expect(
		page.getByRole("heading", { name: "Message failed to send" }),
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();
});

test("restores the contact form after a non-JSON server failure", async ({
	page,
}) => {
	await page.route("**/api/email", async (route) => {
		await route.fulfill({ status: 500, body: "Service unavailable" });
	});
	await page.goto("/contact");
	await fillContactForm(page);
	await page.getByRole("button", { name: "Submit" }).click();

	await expect(
		page.getByRole("heading", { name: "Message failed to send" }),
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();
});

test("moves and selects lesson tabs with the keyboard", async ({ page }) => {
	await page.goto("/lessons");
	const aboutTab = page.getByRole("tab", { name: "About", exact: true });
	const studioTab = page.getByRole("tab", { name: "Studio", exact: true });
	const resumeTab = page.getByRole("tab", {
		name: "Teaching Resume",
		exact: true,
	});

	await aboutTab.focus();
	await aboutTab.press("ArrowRight");
	await expect(studioTab).toBeFocused();
	await expect(studioTab).toHaveAttribute("aria-selected", "true");
	await studioTab.press("End");
	await expect(resumeTab).toBeFocused();
	await expect(resumeTab).toHaveAttribute("aria-selected", "true");
	await resumeTab.press("Home");
	await expect(aboutTab).toBeFocused();
	await aboutTab.press("ArrowLeft");
	await expect(resumeTab).toBeFocused();
	await expect(page.getByRole("tabpanel")).toHaveAttribute(
		"aria-labelledby",
		"lessons-tab-teaching-resume",
	);
});

test("keeps the selected lesson tab at normal-text contrast", async ({
	page,
}) => {
	await page.goto("/lessons");
	const selectedTab = page.getByRole("tab", { selected: true });
	expect(await getContrastRatio(selectedTab)).toBeGreaterThanOrEqual(4.5);
});

test("repartitions engagements after the browser crosses midnight", async ({
	page,
}) => {
	await page.clock.setSystemTime("2026-03-22T23:59:00-07:00");
	await page.goto("/engagements");
	const akhnatenRow = page
		.getByText("Akhnaten", { exact: true })
		.locator("..")
		.locator("..");

	await expect(
		akhnatenRow.getByRole("link", { name: "Buy Tickets" }),
	).toBeVisible();
	await page.clock.runFor("02:00");
	await expect(
		akhnatenRow.getByRole("link", { name: "Company Info" }),
	).toBeVisible();
});

test("shows inline contact form validation without sending a request", async ({
	page,
}) => {
	let requestCount = 0;
	await page.route("**/api/email", async (route) => {
		requestCount += 1;
		await route.fulfill({ status: 200, json: { success: true } });
	});
	await page.goto("/contact");
	for (const [label, maximum] of [
		["Name", emailFieldLimits.name],
		["Email", emailFieldLimits.email],
		["Subject", emailFieldLimits.subject],
		["Message", emailFieldLimits.message],
	] as const) {
		await expect(page.getByLabel(label)).toHaveAttribute(
			"maxlength",
			String(maximum),
		);
	}
	await page.getByRole("button", { name: "Submit" }).click();

	await expect(page.getByRole("alert")).toHaveCount(4);
	expect(requestCount).toBe(0);

	await page.getByLabel("Name").fill("Test Singer");
	await page.getByLabel("Email").fill("not-an-email");
	await page.getByLabel("Subject").fill("Lessons");
	await page.getByLabel("Message").fill("I would like more information.");
	await page.getByRole("button", { name: "Submit" }).click();

	await expect(page.getByRole("alert")).toHaveCount(1);
	await expect(page.getByRole("alert")).toHaveText(
		"Please enter a valid email",
	);
	expect(requestCount).toBe(0);

	await page.getByLabel("Email").fill("singer@example..com");
	await page.getByRole("button", { name: "Submit" }).click();
	await expect(page.getByRole("alert")).toHaveText(
		"Please enter a valid email",
	);
	expect(requestCount).toBe(0);
});
