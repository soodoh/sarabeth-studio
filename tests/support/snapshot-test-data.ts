import { decodeContentfulSnapshot } from "@/utils/contentful-data";

const document = {
	nodeType: "document",
	data: {},
	content: [
		{
			nodeType: "paragraph",
			data: {},
			content: [{ nodeType: "text", value: "Text", marks: [], data: {} }],
		},
	],
};

const image = {
	id: "image-id",
	title: "Image",
	description: "",
	url: "https://images.ctfassets.net/test/master/image-id/image-id.webp",
	width: 100,
	height: 80,
	placeholder: "data:image/gif;base64,AA==",
};

export const createTestSnapshot = () =>
	decodeContentfulSnapshot({
		common: {
			location: "Los Angeles",
			brandName: "Sarabeth",
			socialMediaLinks: [
				{ source: "Instagram", link: "https://instagram.com/test" },
			],
		},
		home: [
			{
				id: "home-id",
				mainSection: true,
				title: "Home",
				description: document,
				buttonText: "About",
				buttonLink: "/about",
				images: [image],
			},
		],
		about: {
			headshot: image,
			bio: document,
			location: "Los Angeles",
		},
		engagements: {
			title: "Engagements",
			bannerImage: image,
			engagements: [
				{
					id: "engagement-id",
					title: "Show",
					role: "Role",
					company: "Company",
					link: "https://example.com/show",
					startDate: "2026-01-01",
					endDate: "2026-01-02",
				},
			],
		},
		lessons: {
			title: "Lessons",
			bannerImage: image,
			followLink: "https://instagram.com/test",
			aboutDescription: document,
			teachingPhilosophy: document,
			studioExpectations: document,
			socialMediaDescription: document,
			socialMediaImage: image,
			teachingResume: document,
			email: "test@example.com",
			phoneNumber: "555-0100",
			reviewLink: "https://example.com/review",
		},
		media: {
			images: [image],
			audio: [
				{
					id: "audio-id",
					title: "Audio",
					description: "",
					url: "https://assets.ctfassets.net/test/master/audio-id/test-audio.wav",
				},
				{
					id: "audio-id-two",
					title: "Second Audio",
					description: "",
					url: "https://downloads.ctfassets.net/test/master/audio-id-two/test-audio.wav",
				},
			],
		},
		contact: { bannerImage: image },
	});
