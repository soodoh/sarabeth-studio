import { expect, test } from "@playwright/test";
import { createTestSnapshot } from "@/tests/support/snapshot-test-data";
import { createImageFormatter, formatAsset } from "@/utils/contentful-assets";
import {
	decodeContentfulSnapshot,
	decodeEngagement,
	decodeImage,
	decodeSocialMediaLink,
} from "@/utils/contentful-data";
import { loadContentfulSnapshot } from "@/utils/contentful-snapshot";
import type {
	ContentfulSnapshot,
	Engagement,
	ImageType,
	SocialMediaLink,
} from "@/utils/types";

const rawImage = {
	sys: { id: "image-id" },
	fields: {
		title: "Image",
		description: "",
		file: {
			url: "//images.ctfassets.net/test/master/image-id/image.jpg",
			details: { image: { width: 100, height: 80 } },
		},
	},
};

test("decodes the committed fixture and reconstructs normalized data", async () => {
	await expect(
		loadContentfulSnapshot(new URL("../fixtures/contentful/", import.meta.url)),
	).resolves.toMatchObject({ common: { brandName: "Sarabeth Belón" } });
	const candidate = Object.freeze(createTestSnapshot());
	const decoded: ContentfulSnapshot = decodeContentfulSnapshot(candidate);
	const image: ImageType = decodeImage(decoded.about.headshot);
	const socialLink: SocialMediaLink = decodeSocialMediaLink({
		source: "Instagram",
		link: "https://instagram.com/test",
	});
	expect(decoded).not.toBe(candidate);
	expect(image.dominantColor).toBeUndefined();
	expect(socialLink.source).toBe("instagram");
	expect(decoded.common.socialMediaLinks[0]?.source).toBe("instagram");
});

test("rejects invalid dimensions, rich text, social sources, URLs, and dates", () => {
	const image = createTestSnapshot().about.headshot;
	for (const dimensions of [
		{ width: 0, height: 1 },
		{ width: 1, height: -1 },
		{ width: Number.NaN, height: 1 },
	]) {
		expect(() => decodeImage({ ...image, ...dimensions })).toThrow(
			/positive finite number/,
		);
	}
	expect(() =>
		decodeContentfulSnapshot({
			...createTestSnapshot(),
			home: [
				{
					...createTestSnapshot().home[0],
					description: {
						nodeType: "document",
						data: {},
						content: [{ nodeType: "paragraph", data: {}, content: [{}] }],
					},
				},
			],
		}),
	).toThrow(/nodeType/);
	expect(() =>
		decodeContentfulSnapshot({
			...createTestSnapshot(),
			about: {
				...createTestSnapshot().about,
				bio: {
					nodeType: "document",
					data: {},
					content: [{ nodeType: "invalid", data: {}, content: [] }],
				},
			},
		}),
	).toThrow(/supported Contentful rich-text node type/);
	expect(() =>
		decodeContentfulSnapshot({
			...createTestSnapshot(),
			about: {
				...createTestSnapshot().about,
				bio: {
					nodeType: "document",
					data: {},
					content: [{ nodeType: "text", data: {}, marks: [], value: "text" }],
				},
			},
		}),
	).toThrow();
	expect(() =>
		decodeSocialMediaLink({ source: "tiktok", link: "https://example.com" }),
	).toThrow(/supported social source/);
	for (const link of [
		"javascript:alert(1)",
		"mailto:",
		"/\\evil.example",
		" https://example.com",
	]) {
		expect(() => decodeSocialMediaLink({ source: "email", link })).toThrow(
			/safe URL/,
		);
	}
	for (const startDate of ["2026-02-30", "2026-02-30T00:00:00Z"]) {
		expect(() =>
			decodeEngagement({
				...createTestSnapshot().engagements.engagements[0],
				startDate,
			}),
		).toThrow(/real calendar date/);
	}
	const engagement: Engagement = decodeEngagement({
		...createTestSnapshot().engagements.engagements[0],
		startDate: "2018-06-29T23:22-12:00",
		endDate: "2018-07-01T12:00-04:00",
	});
	expect(engagement).toMatchObject({
		startDate: "2018-06-29T23:22-12:00",
		endDate: "2018-07-01T12:00-04:00",
	});
	expect(() =>
		decodeEngagement({
			...createTestSnapshot().engagements.engagements[0],
			startDate: "2026-02-02",
			endDate: "2026-02-01",
		}),
	).toThrow(/ordered dates/);
});

test("strict raw asset formatting and image caching follows normalized metadata", async () => {
	expect(() =>
		formatAsset({
			...rawImage,
			fields: { ...rawImage.fields, title: undefined },
		}),
	).toThrow(/title/);
	let placeholderCalls = 0;
	const formatter = createImageFormatter(async () => {
		placeholderCalls += 1;
		return `data:image/gif;base64,${placeholderCalls}`;
	});
	const [first, duplicate] = await Promise.all([
		formatter(rawImage),
		formatter(rawImage),
	]);
	expect(first).toEqual(duplicate);
	expect(placeholderCalls).toBe(1);
	const changed = await formatter({
		...rawImage,
		fields: {
			...rawImage.fields,
			file: {
				...rawImage.fields.file,
				details: { image: { width: 101, height: 80 } },
			},
		},
	});
	expect(changed).toMatchObject({ width: 101 });
	expect(changed.placeholder).not.toBe(first.placeholder);
	expect(placeholderCalls).toBe(2);
});

test("rejects non-image CDN hosts before loading placeholders", async () => {
	let placeholderCalls = 0;
	const formatter = createImageFormatter(async () => {
		placeholderCalls += 1;
		return "data:image/gif;base64,AA==";
	});
	for (const url of [
		"//images.ctfassets.net.example.com/test/master/image-id/image.jpg",
		"//assets.ctfassets.net/test/master/image-id/image.jpg",
		"//downloads.ctfassets.net/test/master/image-id/image.jpg",
	]) {
		await expect(
			formatter({
				...rawImage,
				fields: {
					...rawImage.fields,
					file: { ...rawImage.fields.file, url },
				},
			}),
		).rejects.toThrow(/Unsupported Contentful image URL/);
	}
	expect(placeholderCalls).toBe(0);
	expect(() => formatAsset(rawImage)).toThrow(
		/Unsupported Contentful asset URL/,
	);
	for (const url of [
		"//assets.ctfassets.net/test/master/audio-id/audio.wav",
		"//downloads.ctfassets.net/test/master/audio-id/audio.wav",
	]) {
		expect(
			formatAsset({
				...rawImage,
				fields: {
					...rawImage.fields,
					file: { ...rawImage.fields.file, url },
				},
			}).url,
		).toBe(`https:${url}`);
	}
	for (const url of [
		"//assets.ctfassets.net.example.com/file.pdf",
		"//downloads.ctfassets.net.example.com/file.wav",
	]) {
		expect(() =>
			formatAsset({
				...rawImage,
				fields: {
					...rawImage.fields,
					file: { ...rawImage.fields.file, url },
				},
			}),
		).toThrow(/Unsupported Contentful asset URL/);
	}
});

test("retries identical image work after a transient failure", async () => {
	let placeholderCalls = 0;
	const formatter = createImageFormatter(async () => {
		placeholderCalls += 1;
		if (placeholderCalls === 1) throw new Error("temporary failure");
		return "data:image/gif;base64,AA==";
	});

	await expect(formatter(rawImage)).rejects.toThrow("temporary failure");
	await expect(formatter(rawImage)).resolves.toMatchObject({ id: "image-id" });
	expect(placeholderCalls).toBe(2);
});
