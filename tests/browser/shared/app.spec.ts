import { expect, test } from "@/tests/playwright";

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

test("submits the hydrated contact form to the email endpoint", async ({
	page,
}) => {
	let requestBody: unknown;
	await page.route("**/api/email", async (route) => {
		requestBody = route.request().postDataJSON();
		await route.fulfill({ status: 200, json: { success: true } });
	});
	await page.goto("/contact");
	await page.getByLabel("Name").fill("Test Singer");
	await page.getByLabel("Email").fill("singer@example.com");
	await page.getByLabel("Subject").fill("Lessons");
	await page.getByLabel("Message").fill("I would like more information.");
	await page.getByRole("button", { name: "Submit" }).click();
	await expect(
		page.getByRole("heading", { name: "Message successfully sent!" }),
	).toBeVisible();
	expect(requestBody).toEqual({
		name: "Test Singer",
		email: "singer@example.com",
		subject: "Lessons",
		message: "I would like more information.",
	});
});
