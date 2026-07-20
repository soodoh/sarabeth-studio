import { expect, test } from "@playwright/test";
import {
	contentfulDocumentFixture,
	contentfulEntryFixture,
} from "@/tests/support/contentful-entry-fixture";
import { createImageFormatter } from "@/utils/contentful-assets";
import type { EntryQuery, EntrySource } from "@/utils/contentful-entry-source";
import getAboutData from "@/utils/fetchers/about";
import getCommonData from "@/utils/fetchers/common";
import getContactData from "@/utils/fetchers/contact";
import getEngagementsData from "@/utils/fetchers/engagements";
import getHomeData from "@/utils/fetchers/home";
import getLessonsData from "@/utils/fetchers/lessons";
import getMediaData from "@/utils/fetchers/media";

test("canonical fetchers query and map raw Contentful entries", async () => {
	const queries: EntryQuery[] = [];
	const entrySource: EntrySource = {
		getEntries: async (query) => {
			queries.push(query);
			const contentType = query.content_type;
			if (typeof contentType !== "string") {
				throw new Error("content_type must be a string");
			}
			return { items: contentfulEntryFixture[contentType] ?? [] };
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

	const expectedImage = (id: string) => ({
		id,
		title: `${id} title`,
		description: `${id} description`,
		url: `https://images.ctfassets.net/space/${id}/${id}.jpg`,
		width: 800,
		height: 600,
		placeholder: "data:image/gif;base64,test",
	});
	const expectedAsset = (id: string) => ({
		id,
		title: `${id} title`,
		description: `${id} description`,
		url: `https://assets.ctfassets.net/space/${id}/${id}.wav`,
	});

	expect(common).toEqual({
		brandName: "Sarabeth Belón",
		location: "Los Angeles",
		socialMediaLinks: [
			{ source: "instagram", link: "https://instagram.com/example" },
		],
	});
	expect(home).toEqual([
		{
			id: "home-entry",
			mainSection: true,
			title: "Home",
			subtitle: "Soprano",
			description: contentfulDocumentFixture,
			buttonText: "Learn more",
			buttonLink: "/about",
			images: [expectedImage("home-image")],
		},
	]);
	expect(about).toEqual({
		location: "Los Angeles",
		headshot: expectedImage("headshot"),
		bio: contentfulDocumentFixture,
	});
	expect(engagements).toEqual({
		title: "Engagements",
		bannerImage: expectedImage("engagements-banner"),
		engagements: [
			{
				id: "engagement",
				title: "Show",
				role: "Singer",
				company: "Company",
				link: "https://example.com/show",
				startDate: "2026-01-01",
				endDate: "2026-01-02",
			},
		],
	});
	expect(lessons).toEqual({
		title: "Lessons",
		bannerImage: expectedImage("lessons-banner"),
		aboutDescription: contentfulDocumentFixture,
		teachingPhilosophy: contentfulDocumentFixture,
		studioExpectations: contentfulDocumentFixture,
		socialMediaDescription: contentfulDocumentFixture,
		socialMediaImage: expectedImage("social-image"),
		teachingResume: contentfulDocumentFixture,
		reviewLink: "https://example.com/review",
		phoneNumber: "555-0100",
		email: "studio@example.com",
		followLink: "https://example.com/follow",
	});
	expect(media).toEqual({
		images: [expectedImage("media-image")],
		audio: [expectedAsset("audio")],
	});
	expect(contact).toEqual({
		bannerImage: expectedImage("contact-banner"),
	});
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
