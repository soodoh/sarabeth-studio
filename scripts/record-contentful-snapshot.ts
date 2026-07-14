import { createHash, randomUUID } from "node:crypto";
import {
	access,
	mkdir,
	readFile,
	rename,
	rm,
	writeFile,
} from "node:fs/promises";
import path from "node:path";
import { loadContentfulSnapshot } from "@/utils/contentful-snapshot";
import {
	assertContentfulSnapshot,
	collectSnapshotAssets,
	contentfulSnapshotVersionPattern,
	isImage,
	isRecord,
} from "@/utils/contentful-snapshot-schema";
import getAboutData from "@/utils/fetchers/about";
import getCommonData from "@/utils/fetchers/common";
import getContactData from "@/utils/fetchers/contact";
import getEngagementsData from "@/utils/fetchers/engagements";
import getHomeData from "@/utils/fetchers/home";
import getLessonsData from "@/utils/fetchers/lessons";
import getMediaData from "@/utils/fetchers/media";
import type { ContentfulSnapshot, ImageType } from "@/utils/types";

const snapshotRoot = path.join("public", "contentful-snapshot");
const manifestPath = path.join(snapshotRoot, "manifest.json");
const snapshotImagePlaceholder =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const createTestAudio = (): Uint8Array => {
	const sampleRate = 8_000;
	const durationSeconds = 4;
	const sampleCount = sampleRate * durationSeconds;
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

const collectImages = (value: unknown, images: ImageType[]): void => {
	if (isImage(value)) {
		images.push(value);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) {
			collectImages(item, images);
		}
		return;
	}
	if (isRecord(value)) {
		for (const item of Object.values(value)) {
			collectImages(item, images);
		}
	}
};

const imageFilename = (id: string): string => {
	if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
		throw new Error(`Contentful image has an invalid asset ID: ${id}`);
	}
	return `${id}.webp`;
};

const fileExists = async (filePath: string): Promise<boolean> => {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
};

const readPublishedVersion = async (): Promise<string | undefined> => {
	try {
		const manifest: unknown = JSON.parse(await readFile(manifestPath, "utf8"));
		if (
			isRecord(manifest) &&
			typeof manifest.version === "string" &&
			contentfulSnapshotVersionPattern.test(manifest.version)
		) {
			return manifest.version;
		}
		return undefined;
	} catch {
		return undefined;
	}
};

const [common, home, about, engagements, lessons, media, contact] =
	await Promise.all([
		getCommonData(),
		getHomeData(),
		getAboutData(),
		getEngagementsData(),
		getLessonsData(),
		getMediaData(),
		getContactData(),
	]);
const snapshot: ContentfulSnapshot = {
	common,
	home,
	about,
	engagements,
	lessons,
	media,
	contact,
};

const images: ImageType[] = [];
collectImages(snapshot, images);
for (const image of images) {
	image.placeholder = snapshotImagePlaceholder;
}
const uniqueImages = new Map(images.map((image) => [image.id, image]));

const downloadedImages = await Promise.all(
	[...uniqueImages.values()].map(async (image) => {
		const response = await fetch(`${image.url}?w=1200&q=80&fm=webp`);
		if (!response.ok) {
			throw new Error(`Unable to snapshot Contentful image ${image.id}`);
		}
		return {
			image,
			bytes: new Uint8Array(await response.arrayBuffer()),
		};
	}),
);
const audioBytes = createTestAudio();
const versionHash = createHash("sha256").update(JSON.stringify(snapshot));
for (const { image, bytes } of downloadedImages.toSorted((left, right) =>
	left.image.id.localeCompare(right.image.id),
)) {
	versionHash.update(image.id).update(bytes);
}
versionHash.update(audioBytes);
const version = versionHash.digest("hex").slice(0, 12);
const publicAssetPrefix = `/contentful-snapshot/${version}/`;

for (const image of images) {
	image.url = `${publicAssetPrefix}${imageFilename(image.id)}`;
}
for (const audio of snapshot.media.audio) {
	audio.url = `${publicAssetPrefix}test-audio.wav`;
}

const serializedSnapshot = `${JSON.stringify(snapshot)}\n`;
const parsedSnapshot: unknown = JSON.parse(serializedSnapshot);
assertContentfulSnapshot(parsedSnapshot);

await mkdir(snapshotRoot, { recursive: true });
const stagedDirectory = path.join(snapshotRoot, `.next-${randomUUID()}`);
const versionDirectory = path.join(snapshotRoot, version);
await rm(stagedDirectory, { force: true, recursive: true });
await mkdir(stagedDirectory, { recursive: true });
await Promise.all([
	...downloadedImages.map(({ image, bytes }) =>
		writeFile(path.join(stagedDirectory, imageFilename(image.id)), bytes),
	),
	writeFile(path.join(stagedDirectory, "test-audio.wav"), audioBytes),
	writeFile(path.join(stagedDirectory, "snapshot.json"), serializedSnapshot),
]);

for (const { url } of collectSnapshotAssets(parsedSnapshot)) {
	if (!url.startsWith(publicAssetPrefix)) {
		throw new Error(`Contentful snapshot contains external asset: ${url}`);
	}
	await access(path.join(stagedDirectory, url.slice(publicAssetPrefix.length)));
}

if (await fileExists(versionDirectory)) {
	await rm(stagedDirectory, { force: true, recursive: true });
} else {
	try {
		await rename(stagedDirectory, versionDirectory);
	} catch (error) {
		if (!(await fileExists(versionDirectory))) {
			throw error;
		}
		await rm(stagedDirectory, { force: true, recursive: true });
	}
}

const previousVersion = await readPublishedVersion();
const stagedManifestPath = path.join(
	snapshotRoot,
	`.manifest-${randomUUID()}.next`,
);
await writeFile(
	stagedManifestPath,
	`${JSON.stringify({ version }, null, "\t")}\n`,
);
await rename(stagedManifestPath, manifestPath);

if (previousVersion && previousVersion !== version) {
	try {
		await rm(path.join(snapshotRoot, previousVersion), {
			force: true,
			recursive: true,
		});
	} catch (error) {
		console.warn(
			"Recorded the snapshot but could not remove its old version",
			error,
		);
	}
}

await loadContentfulSnapshot();
console.log(
	`Recorded ${uniqueImages.size} images and ${snapshot.media.audio.length} audio entries in snapshot ${version}`,
);
