import { expect, test } from "@playwright/test";
import { getContentfulClient } from "@/utils/contentful";

test("defers Contentful environment validation until the client is used", () => {
	const previousSpace = process.env.CONTENTFUL_SPACE_ID;
	const previousAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
	delete process.env.CONTENTFUL_SPACE_ID;
	delete process.env.CONTENTFUL_ACCESS_TOKEN;

	try {
		expect(() => getContentfulClient()).toThrow(
			"Missing Contentful build environment variables",
		);
	} finally {
		if (previousSpace === undefined) delete process.env.CONTENTFUL_SPACE_ID;
		else process.env.CONTENTFUL_SPACE_ID = previousSpace;
		if (previousAccessToken === undefined)
			delete process.env.CONTENTFUL_ACCESS_TOKEN;
		else process.env.CONTENTFUL_ACCESS_TOKEN = previousAccessToken;
	}
});
