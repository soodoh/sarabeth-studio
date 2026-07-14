import { expect, test } from "@playwright/test";
import { createImageFormatter } from "@/utils/contentful-assets";
import type { EntryQuery, EntrySource } from "@/utils/contentful-entry-source";
import getAboutData from "@/utils/fetchers/about";
import getCommonData from "@/utils/fetchers/common";
import getContactData from "@/utils/fetchers/contact";
import getEngagementsData from "@/utils/fetchers/engagements";
import getHomeData from "@/utils/fetchers/home";
import getLessonsData from "@/utils/fetchers/lessons";
import getMediaData from "@/utils/fetchers/media";

const document = {
	nodeType: "document",
	data: {},
	content: [
		{
			nodeType: "paragraph",
			data: {},
			content: [{ nodeType: "text", data: {}, value: "Text", marks: [] }],
		},
	],
};

const asset = (id: string, image = true) => ({
	sys: { id },
	fields: {
		title: `${id} title`,
		description: `${id} description`,
		file: {
			url: image
				? `//images.ctfassets.net/space/${id}/${id}.jpg`
				: `//assets.ctfassets.net/space/${id}/${id}.wav`,
			details: image ? { image: { width: 800, height: 600 } } : {},
		},
	},
});

const entries: Readonly<Record<string, readonly unknown[]>> = {
	about: [
		{
			sys: { id: "about" },
			fields: {
				title: "Sarabeth Belón",
				location: "Los Angeles",
				headshot: asset("headshot"),
				bio: document,
				resume: asset("resume", false),
			},
		},
	],
	socialMedia: [
		{
			sys: { id: "social" },
			fields: {
				order: 1,
				source: "Instagram",
				link: "https://instagram.com/example",
			},
		},
	],
	home: [
		{
			sys: { id: "home-entry" },
			fields: {
				order: 1,
				mainSection: true,
				title: "Home",
				description: document,
				images: [asset("home-image")],
			},
		},
	],
	engagementsPage: [
		{
			sys: { id: "engagements-page" },
			fields: { title: "Engagements", banner: asset("engagements-banner") },
		},
	],
	engagements: [
		{
			sys: { id: "engagement" },
			fields: {
				label: "Show",
				role: "Singer",
				company: "Company",
				link: "https://example.com/show",
				startDate: "2026-01-01",
				endDate: "2026-01-02",
			},
		},
	],
	lessons: [
		{
			sys: { id: "lessons" },
			fields: {
				title: "Lessons",
				bannerImage: asset("lessons-banner"),
				aboutDescription: document,
				teachingPhilosophy: document,
				studioExpectations: document,
				socialMediaDescription: document,
				socialMediaImage: asset("social-image"),
				teachingResume: document,
				reviewLink: "https://example.com/review",
				phoneNumber: "555-0100",
				email: "studio@example.com",
				followLink: "https://example.com/follow",
			},
		},
	],
	mediaPage: [
		{
			sys: { id: "media" },
			fields: {
				images: [asset("media-image")],
				audio: [asset("audio", false)],
			},
		},
	],
	contact: [
		{
			sys: { id: "contact" },
			fields: { bannerImage: asset("contact-banner") },
		},
	],
};

test("canonical fetchers query and map raw Contentful entries", async () => {
	const queries: EntryQuery[] = [];
	const entrySource: EntrySource = {
		getEntries: async (query) => {
			queries.push(query);
			const contentType = query.content_type;
			if (typeof contentType !== "string") {
				throw new Error("content_type must be a string");
			}
			return { items: entries[contentType] ?? [] };
		},
	};
	const formatImage = createImageFormatter(
		async () => "data:image/gif;base64,test",
	);

	const [common, home, about, engagements, lessons, media, contact] =
		await Promise.all([
			getCommonData(entrySource),
			getHomeData(entrySource, formatImage),
			getAboutData(entrySource, formatImage),
			getEngagementsData(entrySource, formatImage),
			getLessonsData(entrySource, formatImage),
			getMediaData(entrySource, formatImage),
			getContactData(entrySource, formatImage),
		]);

	expect(common).toMatchObject({
		brandName: "Sarabeth Belón",
		socialMediaLinks: [{ source: "instagram" }],
	});
	expect(home).toMatchObject([
		{ id: "home-entry", title: "Home", images: [{ id: "home-image" }] },
	]);
	expect(about).toMatchObject({
		location: "Los Angeles",
		headshot: { id: "headshot" },
	});
	expect(engagements).toMatchObject({
		title: "Engagements",
		engagements: [{ id: "engagement", title: "Show" }],
	});
	expect(lessons).toMatchObject({
		title: "Lessons",
		socialMediaImage: { id: "social-image" },
	});
	expect(media).toMatchObject({
		images: [{ id: "media-image" }],
		audio: [{ id: "audio" }],
	});
	expect(contact).toMatchObject({ bannerImage: { id: "contact-banner" } });
	expect(queries).toContainEqual({
		content_type: "home",
		order: ["fields.order"],
	});
	expect(queries).toContainEqual({
		content_type: "socialMedia",
		order: ["fields.order"],
	});
	expect(queries.map((query) => query.content_type)).toEqual(
		expect.arrayContaining([
			"about",
			"home",
			"engagementsPage",
			"engagements",
			"lessons",
			"mediaPage",
			"contact",
		]),
	);
});
