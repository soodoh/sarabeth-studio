import type { Document } from "@contentful/rich-text-types";
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

export const contentfulSnapshotVersionPattern = /^[a-f0-9]{12}$/;

const socialMediaTypes: SocialMediaType[] = [
	"facebook",
	"Facebook",
	"instagram",
	"Instagram",
	"linkedin",
	"Linkedin",
	"twitter",
	"Twitter",
	"youtube",
	"Youtube",
	"email",
	"Email",
];

export const isRecord = (value: unknown): value is UnknownRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number =>
	typeof value === "number" && Number.isFinite(value);
const isBoolean = (value: unknown): value is boolean =>
	typeof value === "boolean";
const isOptionalString = (value: unknown): value is string | undefined =>
	value === undefined || isString(value);
const isArrayOf = <T>(
	value: unknown,
	isItem: (item: unknown) => item is T,
): value is T[] => Array.isArray(value) && value.every(isItem);

const isDocument = (value: unknown): value is Document =>
	isRecord(value) &&
	value.nodeType === "document" &&
	isRecord(value.data) &&
	Array.isArray(value.content);

export const isAsset = (value: unknown): value is Asset =>
	isRecord(value) &&
	isString(value.id) &&
	isString(value.title) &&
	isString(value.description) &&
	isString(value.url);

export const isImage = (value: unknown): value is ImageType =>
	isRecord(value) &&
	isString(value.id) &&
	isString(value.title) &&
	isString(value.description) &&
	isString(value.url) &&
	isNumber(value.width) &&
	isNumber(value.height) &&
	isString(value.placeholder) &&
	(value.dominantColor === undefined || isString(value.dominantColor));

const isSocialMediaLink = (value: unknown): value is SocialMediaLink =>
	isRecord(value) &&
	isString(value.source) &&
	socialMediaTypes.some((source) => source === value.source) &&
	isString(value.link);

const isCommonData = (value: unknown): value is CommonData =>
	isRecord(value) &&
	isString(value.location) &&
	isString(value.brandName) &&
	isArrayOf(value.socialMediaLinks, isSocialMediaLink);

const isHomeData = (value: unknown): value is HomeData =>
	isRecord(value) &&
	isString(value.id) &&
	isBoolean(value.mainSection) &&
	isString(value.title) &&
	isDocument(value.description) &&
	isOptionalString(value.subtitle) &&
	isOptionalString(value.buttonText) &&
	isOptionalString(value.buttonLink) &&
	isArrayOf(value.images, isImage);

const isAboutData = (value: unknown): value is AboutData =>
	isRecord(value) &&
	isImage(value.headshot) &&
	isDocument(value.bio) &&
	isString(value.resume) &&
	isString(value.location);

const isEngagement = (value: unknown): value is Engagement =>
	isRecord(value) &&
	isString(value.id) &&
	isString(value.title) &&
	isString(value.role) &&
	isString(value.company) &&
	isString(value.link) &&
	isString(value.startDate) &&
	isString(value.endDate);

const isEngagementData = (value: unknown): value is EngagementData =>
	isRecord(value) &&
	isString(value.title) &&
	isImage(value.bannerImage) &&
	isArrayOf(value.engagements, isEngagement);

const isLessonsData = (value: unknown): value is LessonsData =>
	isRecord(value) &&
	isString(value.title) &&
	isImage(value.bannerImage) &&
	isString(value.followLink) &&
	isDocument(value.aboutDescription) &&
	isDocument(value.teachingPhilosophy) &&
	isDocument(value.studioExpectations) &&
	isDocument(value.socialMediaDescription) &&
	isImage(value.socialMediaImage) &&
	isDocument(value.teachingResume) &&
	isString(value.email) &&
	isString(value.phoneNumber) &&
	isString(value.reviewLink);

const isMediaData = (value: unknown): value is MediaData =>
	isRecord(value) &&
	isArrayOf(value.images, isImage) &&
	isArrayOf(value.audio, isAsset);

const isContactData = (value: unknown): value is ContactData =>
	isRecord(value) && isImage(value.bannerImage);

export const isContentfulSnapshot = (
	value: unknown,
): value is ContentfulSnapshot =>
	isRecord(value) &&
	isCommonData(value.common) &&
	isArrayOf(value.home, isHomeData) &&
	isAboutData(value.about) &&
	isEngagementData(value.engagements) &&
	isLessonsData(value.lessons) &&
	isMediaData(value.media) &&
	isContactData(value.contact);

export function assertContentfulSnapshot(
	value: unknown,
): asserts value is ContentfulSnapshot {
	if (!isContentfulSnapshot(value)) {
		throw new Error("Invalid Contentful snapshot data");
	}
}

export const collectSnapshotAssets = (value: unknown): Asset[] => {
	if (isAsset(value)) {
		return [value];
	}
	if (Array.isArray(value)) {
		return value.flatMap(collectSnapshotAssets);
	}
	if (isRecord(value)) {
		return Object.values(value).flatMap(collectSnapshotAssets);
	}
	return [];
};
