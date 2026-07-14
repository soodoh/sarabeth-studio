import {
	BLOCKS,
	type Document,
	INLINES,
	MARKS,
	validateRichTextDocument,
} from "@contentful/rich-text-types";
import type {
	AboutData,
	Asset,
	CommonData,
	ContactData,
	ContentfulSnapshot,
	Engagement,
	EngagementData,
	HomeData,
	ImageType,
	LessonsData,
	MediaData,
	SocialMediaLink,
	SocialMediaType,
} from "@/utils/types";

type UnknownRecord = Record<string, unknown>;

const fail = (path: string, expectation: string): never => {
	throw new Error(`${path} must be ${expectation}`);
};

const isRecord = (value: unknown): value is UnknownRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value);

export const readRecord = (value: unknown, path: string): UnknownRecord => {
	if (!isRecord(value)) return fail(path, "an object");
	return value;
};

const readString = (value: unknown, path: string): string => {
	if (typeof value !== "string" || value.length === 0) {
		return fail(path, "a non-empty string");
	}
	return value;
};

const readDescription = (value: unknown, path: string): string => {
	if (typeof value !== "string") return fail(path, "a string");
	return value;
};

const readOptionalString = (value: unknown, path: string) =>
	value === undefined ? undefined : readString(value, path);

const readBoolean = (value: unknown, path: string): boolean => {
	if (typeof value !== "boolean") return fail(path, "a boolean");
	return value;
};

const readArray = <T>(
	value: unknown,
	path: string,
	decode: (item: unknown, path: string) => T,
): T[] => {
	if (!Array.isArray(value)) return fail(path, "an array");
	return value.map((item, index) => decode(item, `${path}[${index}]`));
};

const readPositiveNumber = (value: unknown, path: string): number => {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
		return fail(path, "a positive finite number");
	}
	return value;
};

const readUrl = (
	value: unknown,
	path: string,
	options: { internal?: boolean; mailto?: boolean } = {},
): string => {
	const source = readString(value, path);
	if (source.trim() !== source || source.includes("\\")) {
		return fail(path, "a safe URL");
	}
	if (options.internal && source.startsWith("/") && !source.startsWith("//")) {
		const internalOrigin = "https://internal.invalid";
		if (new URL(source, internalOrigin).origin === internalOrigin) {
			return source;
		}
		return fail(path, "a safe URL");
	}
	let url: URL;
	try {
		url = new URL(source);
	} catch {
		return fail(path, "a safe URL");
	}
	const allowed =
		url.protocol === "http:" ||
		url.protocol === "https:" ||
		(options.mailto && url.protocol === "mailto:");
	if (
		!allowed ||
		(url.protocol === "mailto:" ? !url.pathname : !url.hostname)
	) {
		return fail(path, "a safe URL");
	}
	return source;
};

const readDate = (value: unknown, path: string): string => {
	const date = readString(value, path);
	const datePrefix = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
	if (!datePrefix) {
		return fail(path, "a valid ISO date or date-time");
	}
	const year = Number(datePrefix[1]);
	const month = Number(datePrefix[2]);
	const day = Number(datePrefix[3]);
	const parsedDate = new Date(Date.UTC(year, month - 1, day));
	if (
		parsedDate.getUTCFullYear() !== year ||
		parsedDate.getUTCMonth() !== month - 1 ||
		parsedDate.getUTCDate() !== day
	) {
		return fail(path, "a real calendar date");
	}
	if (date.length === 10) {
		return date;
	}
	if (date[10] !== "T" || !Number.isFinite(Date.parse(date))) {
		return fail(path, "a valid ISO date or date-time");
	}
	return date;
};

const richNodeTypes = new Set<string>([
	"text",
	...Object.values(BLOCKS),
	...Object.values(INLINES),
]);
const richMarkTypes = new Set<string>(Object.values(MARKS));

const validateRichNode = (value: unknown, path: string): void => {
	const node = readRecord(value, path);
	const nodeType = readString(node.nodeType, `${path}.nodeType`);
	if (!richNodeTypes.has(nodeType)) {
		fail(`${path}.nodeType`, "a supported Contentful rich-text node type");
	}
	readRecord(node.data, `${path}.data`);
	if (nodeType === "text") {
		if (typeof node.value !== "string") fail(`${path}.value`, "a string");
		readArray(node.marks, `${path}.marks`, (mark, markPath) => {
			const record = readRecord(mark, markPath);
			const markType = readString(record.type, `${markPath}.type`);
			if (!richMarkTypes.has(markType)) {
				fail(`${markPath}.type`, "a supported Contentful rich-text mark type");
			}
			return markType;
		});
		return;
	}
	readArray(node.content, `${path}.content`, (child, childPath) => {
		validateRichNode(child, childPath);
		return child;
	});
};

function assertDocument(
	value: unknown,
	path: string,
): asserts value is Document {
	validateRichNode(value, path);
	const root = readRecord(value, path);
	if (root.nodeType !== BLOCKS.DOCUMENT) {
		fail(`${path}.nodeType`, `"${BLOCKS.DOCUMENT}"`);
	}
}

const decodeDocument = (value: unknown, path: string): Document => {
	assertDocument(value, path);
	const validationError = validateRichTextDocument(value)[0];
	if (validationError) {
		const validationPath = [path, ...(validationError.path ?? [])].join(".");
		fail(
			validationPath,
			validationError.customMessage ??
				validationError.details ??
				"a valid Contentful rich-text document",
		);
	}
	return value;
};

export const decodeAsset = (value: unknown, path = "asset"): Asset => {
	const asset = readRecord(value, path);
	return {
		id: readString(asset.id, `${path}.id`),
		title: readString(asset.title, `${path}.title`),
		description: readDescription(asset.description, `${path}.description`),
		url: readUrl(asset.url, `${path}.url`, { internal: true }),
	};
};

export const decodeImage = (value: unknown, path = "image"): ImageType => {
	const image = readRecord(value, path);
	const dominantColor = readOptionalString(
		image.dominantColor,
		`${path}.dominantColor`,
	);
	return {
		...decodeAsset(image, path),
		width: readPositiveNumber(image.width, `${path}.width`),
		height: readPositiveNumber(image.height, `${path}.height`),
		placeholder: readString(image.placeholder, `${path}.placeholder`),
		...(dominantColor === undefined ? {} : { dominantColor }),
	};
};

export const decodeSocialMediaType = (
	value: unknown,
	path = "source",
): SocialMediaType => {
	const source = readString(value, path).toLowerCase();
	switch (source) {
		case "facebook":
		case "instagram":
		case "linkedin":
		case "twitter":
		case "youtube":
		case "email":
			return source;
		default:
			return fail(path, "a supported social source");
	}
};

export const decodeSocialMediaLink = (
	value: unknown,
	path = "socialMediaLink",
): SocialMediaLink => {
	const link = readRecord(value, path);
	return {
		source: decodeSocialMediaType(link.source, `${path}.source`),
		link: readUrl(link.link, `${path}.link`, { internal: true, mailto: true }),
	};
};

export const decodeCommonData = (
	value: unknown,
	path = "common",
): CommonData => {
	const data = readRecord(value, path);
	return {
		location: readString(data.location, `${path}.location`),
		brandName: readString(data.brandName, `${path}.brandName`),
		socialMediaLinks: readArray(
			data.socialMediaLinks,
			`${path}.socialMediaLinks`,
			decodeSocialMediaLink,
		),
	};
};

export const decodeHomeData = (value: unknown, path = "home"): HomeData => {
	const data = readRecord(value, path);
	return {
		id: readString(data.id, `${path}.id`),
		mainSection: readBoolean(data.mainSection, `${path}.mainSection`),
		title: readString(data.title, `${path}.title`),
		description: decodeDocument(data.description, `${path}.description`),
		subtitle: readOptionalString(data.subtitle, `${path}.subtitle`),
		buttonText: readOptionalString(data.buttonText, `${path}.buttonText`),
		buttonLink:
			data.buttonLink === undefined
				? undefined
				: readUrl(data.buttonLink, `${path}.buttonLink`, { internal: true }),
		images: readArray(data.images, `${path}.images`, decodeImage),
	};
};

export const decodeAboutData = (value: unknown, path = "about"): AboutData => {
	const data = readRecord(value, path);
	return {
		headshot: decodeImage(data.headshot, `${path}.headshot`),
		bio: decodeDocument(data.bio, `${path}.bio`),
		resume: readUrl(data.resume, `${path}.resume`, { internal: true }),
		location: readString(data.location, `${path}.location`),
	};
};

export const decodeEngagement = (
	value: unknown,
	path = "engagement",
): Engagement => {
	const data = readRecord(value, path);
	const startDate = readDate(data.startDate, `${path}.startDate`);
	const endDate = readDate(data.endDate, `${path}.endDate`);
	if (Date.parse(startDate) > Date.parse(endDate)) {
		fail(path, "an engagement with ordered dates");
	}
	return {
		id: readString(data.id, `${path}.id`),
		title: readString(data.title, `${path}.title`),
		role: readString(data.role, `${path}.role`),
		company: readString(data.company, `${path}.company`),
		link: readUrl(data.link, `${path}.link`, { internal: true }),
		startDate,
		endDate,
	};
};

export const decodeEngagementData = (
	value: unknown,
	path = "engagements",
): EngagementData => {
	const data = readRecord(value, path);
	return {
		title: readString(data.title, `${path}.title`),
		bannerImage: decodeImage(data.bannerImage, `${path}.bannerImage`),
		engagements: readArray(
			data.engagements,
			`${path}.engagements`,
			decodeEngagement,
		),
	};
};

export const decodeLessonsData = (
	value: unknown,
	path = "lessons",
): LessonsData => {
	const data = readRecord(value, path);
	return {
		title: readString(data.title, `${path}.title`),
		bannerImage: decodeImage(data.bannerImage, `${path}.bannerImage`),
		followLink: readUrl(data.followLink, `${path}.followLink`, {
			internal: true,
		}),
		aboutDescription: decodeDocument(
			data.aboutDescription,
			`${path}.aboutDescription`,
		),
		teachingPhilosophy: decodeDocument(
			data.teachingPhilosophy,
			`${path}.teachingPhilosophy`,
		),
		studioExpectations: decodeDocument(
			data.studioExpectations,
			`${path}.studioExpectations`,
		),
		socialMediaDescription: decodeDocument(
			data.socialMediaDescription,
			`${path}.socialMediaDescription`,
		),
		socialMediaImage: decodeImage(
			data.socialMediaImage,
			`${path}.socialMediaImage`,
		),
		teachingResume: decodeDocument(
			data.teachingResume,
			`${path}.teachingResume`,
		),
		email: readString(data.email, `${path}.email`),
		phoneNumber: readString(data.phoneNumber, `${path}.phoneNumber`),
		reviewLink: readUrl(data.reviewLink, `${path}.reviewLink`, {
			internal: true,
		}),
	};
};

export const decodeMediaData = (value: unknown, path = "media"): MediaData => {
	const data = readRecord(value, path);
	return {
		images: readArray(data.images, `${path}.images`, decodeImage),
		audio: readArray(data.audio, `${path}.audio`, decodeAsset),
	};
};

export const decodeContactData = (
	value: unknown,
	path = "contact",
): ContactData => {
	const data = readRecord(value, path);
	return {
		bannerImage: decodeImage(data.bannerImage, `${path}.bannerImage`),
	};
};

export const decodeContentfulSnapshot = (
	value: unknown,
): ContentfulSnapshot => {
	const data = readRecord(value, "snapshot");
	return {
		common: decodeCommonData(data.common),
		home: readArray(data.home, "home", decodeHomeData),
		about: decodeAboutData(data.about),
		engagements: decodeEngagementData(data.engagements),
		lessons: decodeLessonsData(data.lessons),
		media: decodeMediaData(data.media),
		contact: decodeContactData(data.contact),
	};
};

export const getSnapshotImages = (
	snapshot: ContentfulSnapshot,
): ImageType[] => [
	...snapshot.home.flatMap(({ images }) => images),
	snapshot.about.headshot,
	snapshot.engagements.bannerImage,
	snapshot.lessons.bannerImage,
	snapshot.lessons.socialMediaImage,
	...snapshot.media.images,
	snapshot.contact.bannerImage,
];

export const getSnapshotAudio = (snapshot: ContentfulSnapshot): Asset[] =>
	snapshot.media.audio;

export const getSnapshotAssets = (snapshot: ContentfulSnapshot): Asset[] => [
	...getSnapshotImages(snapshot),
	...getSnapshotAudio(snapshot),
];
