export const contentfulDocumentFixture = {
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

export const contentfulEntryFixture: Readonly<
	Record<string, readonly unknown[]>
> = {
	about: [
		{
			sys: { id: "about" },
			fields: {
				title: "Sarabeth Belón",
				location: "Los Angeles",
				headshot: asset("headshot"),
				bio: contentfulDocumentFixture,
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
				subtitle: "Soprano",
				description: contentfulDocumentFixture,
				buttonText: "Learn more",
				buttonLink: "/about",
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
				aboutDescription: contentfulDocumentFixture,
				teachingPhilosophy: contentfulDocumentFixture,
				studioExpectations: contentfulDocumentFixture,
				socialMediaDescription: contentfulDocumentFixture,
				socialMediaImage: asset("social-image"),
				teachingResume: contentfulDocumentFixture,
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
