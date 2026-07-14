import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
	createImageFormatter,
	type ImageFormatter,
} from "@/utils/contentful-assets";
import { decodeContentfulSnapshot } from "@/utils/contentful-data";
import { createContentfulDataProvider } from "@/utils/contentful-data-provider";
import { contentfulEntrySource } from "@/utils/contentful-entry-source.server";
import {
	assertWebP,
	contentfulAssetFilename,
	swapSnapshotDirectory,
	validateContentfulImageUrl,
	validateSnapshotDirectory,
} from "@/utils/contentful-snapshot";
import type { ImageType } from "@/utils/types";

const snapshotRoot = path.join("tests", "fixtures", "contentful");
const snapshotImagePlaceholder =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const createTestAudio = (): Uint8Array => {
	const sampleRate = 8_000;
	const sampleCount = sampleRate * 4;
	const bytesPerSample = 2;
	const dataSize = sampleCount * bytesPerSample;
	const buffer = new ArrayBuffer(44 + dataSize);
	const view = new DataView(buffer);
	const writeText = (offset: number, text: string): void => {
		for (const [index, character] of [...text].entries()) {
			view.setUint8(offset + index, character.charCodeAt(0));
		}
	};
	writeText(0, "RIFF");
	view.setUint32(4, 36 + dataSize, true);
	writeText(8, "WAVE");
	writeText(12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, 1, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * bytesPerSample, true);
	view.setUint16(32, bytesPerSample, true);
	view.setUint16(34, 16, true);
	writeText(36, "data");
	view.setUint32(40, dataSize, true);
	for (let index = 0; index < sampleCount; index += 1) {
		const fade = Math.min(1, index / 400, (sampleCount - index) / 400);
		const sample = Math.sin((2 * Math.PI * 440 * index) / sampleRate);
		view.setInt16(44 + index * bytesPerSample, sample * fade * 8_000, true);
	}
	return new Uint8Array(buffer);
};

const recordedImages = new Map<string, ImageType>();
const constantFormatter = createImageFormatter(
	async () => snapshotImagePlaceholder,
);
const recordingFormatter: ImageFormatter = async (value, fieldPath) => {
	const image = await constantFormatter(value, fieldPath);
	recordedImages.set(image.id, image);
	return image;
};
const recordingProvider = createContentfulDataProvider({
	entrySource: contentfulEntrySource,
	imageFormatter: recordingFormatter,
});

const [common, home, about, engagements, lessons, media, contact] =
	await Promise.all([
		recordingProvider.getCommonData(),
		recordingProvider.getHomeData(),
		recordingProvider.getAboutData(),
		recordingProvider.getEngagementsData(),
		recordingProvider.getLessonsData(),
		recordingProvider.getMediaData(),
		recordingProvider.getContactData(),
	]);
const snapshot = decodeContentfulSnapshot({
	common,
	home,
	about,
	engagements,
	lessons,
	media,
	contact,
});
const serializedSnapshot = `${JSON.stringify(snapshot, null, 2)}\n`;
const downloadedImages = await Promise.all(
	[...recordedImages.values()].map(async (image) => {
		const url = validateContentfulImageUrl(image);
		url.searchParams.set("w", "1200");
		url.searchParams.set("q", "80");
		url.searchParams.set("fm", "webp");
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Unable to snapshot Contentful image ${image.id}`);
		}
		const contentType = response.headers
			.get("content-type")
			?.split(";", 1)[0]
			?.trim()
			.toLowerCase();
		if (contentType !== "image/webp") {
			throw new Error(`Contentful image ${image.id} was not image/webp`);
		}
		const bytes = new Uint8Array(await response.arrayBuffer());
		if (bytes.byteLength === 0) {
			throw new Error(`Contentful image ${image.id} was empty`);
		}
		assertWebP(bytes);
		return { filename: contentfulAssetFilename(image, "image"), bytes };
	}),
);
const audioBytes = createTestAudio();
const files = [
	{
		filename: "snapshot.json",
		bytes: new TextEncoder().encode(serializedSnapshot),
	},
	...downloadedImages,
	...snapshot.media.audio.map((audio) => ({
		filename: contentfulAssetFilename(audio, "asset"),
		bytes: audioBytes,
	})),
].toSorted((left, right) =>
	left.filename < right.filename ? -1 : left.filename > right.filename ? 1 : 0,
);
const filenames = new Set<string>();
for (const { filename } of files) {
	if (filenames.has(filename)) {
		throw new Error(`Duplicate staged snapshot filename: ${filename}`);
	}
	filenames.add(filename);
}
const fixtureParent = path.dirname(snapshotRoot);
const stagedDirectory = path.join(
	fixtureParent,
	`.contentful-next-${randomUUID()}`,
);
try {
	await mkdir(stagedDirectory, { recursive: true });
	await Promise.all(
		files.map(({ filename, bytes }) =>
			writeFile(path.join(stagedDirectory, filename), bytes),
		),
	);
	await validateSnapshotDirectory(stagedDirectory);
	await swapSnapshotDirectory(stagedDirectory, snapshotRoot);
} finally {
	await rm(stagedDirectory, { force: true, recursive: true });
}
console.log(
	`Recorded ${recordedImages.size} images and ${snapshot.media.audio.length} audio entries`,
);
