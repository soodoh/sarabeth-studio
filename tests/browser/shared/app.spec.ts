import { expect, type Page, test } from "@/tests/playwright";
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
		await page.getByRole("button", { name: "Open Navigation" }).click();
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

test("submits the hydrated contact form to the email endpoint", async ({
	page,
}) => {
	let requestBody: unknown;
	let contentType: string | undefined;
	await page.route("**/api/email", async (route) => {
		requestBody = route.request().postDataJSON();
		contentType = route.request().headers()["content-type"];
		await route.fulfill({ status: 200, json: { success: true } });
	});
	await page.goto("/contact");
	await fillContactForm(page);
	await page.getByRole("button", { name: "Submit" }).click();
	await expect(
		page.getByRole("heading", { name: "Message successfully sent!" }),
	).toBeVisible();
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
