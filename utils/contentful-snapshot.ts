import { lstat, readdir, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	type ContentfulAssetKind,
	validateContentfulAssetUrl,
} from "@/utils/contentful-asset-url";
import {
	decodeContentfulSnapshot,
	getSnapshotAudio,
	getSnapshotImages,
} from "@/utils/contentful-data";
import type { Asset, ContentfulSnapshot } from "@/utils/types";

const contentfulAssetIdPattern = /^[a-zA-Z0-9_-]+$/;
const snapshotFilename = "snapshot.json";

const toPath = (root: string | URL): string =>
	path.resolve(typeof root === "string" ? root : fileURLToPath(root));

const validateSnapshotAssetUrl = (
	asset: Asset,
	kind: ContentfulAssetKind,
): URL => {
	if (!contentfulAssetIdPattern.test(asset.id)) {
		throw new Error(`Snapshot asset has an invalid ID: ${asset.id}`);
	}
	const url = validateContentfulAssetUrl(asset.url, kind);
	const segments = url.pathname.split("/").filter(Boolean);
	if (!segments.includes(asset.id)) {
		throw new Error(`Snapshot asset URL is not keyed by ID: ${asset.url}`);
	}
	return url;
};

export const validateContentfulImageUrl = (asset: Asset): URL =>
	validateSnapshotAssetUrl(asset, "image");

export const contentfulAssetFilename = (
	asset: Asset,
	kind: ContentfulAssetKind,
): string => {
	validateSnapshotAssetUrl(asset, kind);
	return kind === "image" ? `${asset.id}.webp` : `${asset.id}.wav`;
};

export const assertWebP = (bytes: Uint8Array): void => {
	const text = (offset: number): string =>
		String.fromCharCode(...bytes.subarray(offset, offset + 4));
	if (bytes.byteLength < 12 || text(0) !== "RIFF" || text(8) !== "WEBP") {
		throw new Error("Snapshot image must contain a WebP payload");
	}
};

const expectedSnapshotFilenames = (snapshot: ContentfulSnapshot): Set<string> =>
	new Set([
		snapshotFilename,
		...getSnapshotImages(snapshot).map((image) =>
			contentfulAssetFilename(image, "image"),
		),
		...getSnapshotAudio(snapshot).map((audio) =>
			contentfulAssetFilename(audio, "asset"),
		),
	]);

export const validateSnapshotDirectory = async (
	directory: string,
): Promise<ContentfulSnapshot> => {
	const entries = await readdir(directory, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isFile()) {
			throw new Error(`Snapshot inventory contains a non-file: ${entry.name}`);
		}
	}
	const snapshot = decodeContentfulSnapshot(
		JSON.parse(await readFile(path.join(directory, snapshotFilename), "utf8")),
	);
	const expected = expectedSnapshotFilenames(snapshot);
	const actual = new Set(entries.map(({ name }) => name));
	const missing = [...expected].filter((filename) => !actual.has(filename));
	const unexpected = [...actual].filter((filename) => !expected.has(filename));
	if (missing.length > 0 || unexpected.length > 0) {
		const details = [
			missing.length > 0
				? `missing ${missing.toSorted().join(", ")}`
				: undefined,
			unexpected.length > 0
				? `unexpected ${unexpected.toSorted().join(", ")}`
				: undefined,
		].filter((detail) => detail !== undefined);
		throw new Error(`Snapshot inventory mismatch: ${details.join("; ")}`);
	}
	await Promise.all(
		[...expected].map(async (filename) => {
			const bytes = await readFile(path.join(directory, filename));
			if (bytes.byteLength === 0) {
				throw new Error(`Snapshot asset must be a non-empty file: ${filename}`);
			}
			if (filename.endsWith(".webp")) assertWebP(bytes);
		}),
	);
	return snapshot;
};

const snapshotBackupDirectory = (snapshotRoot: string): string =>
	`${snapshotRoot}.backup`;

const pathExists = async (target: string): Promise<boolean> => {
	try {
		await lstat(target);
		return true;
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return false;
		}
		throw error;
	}
};

const recoverSnapshotDirectory = async (
	snapshotRoot: string,
): Promise<void> => {
	const backupDirectory = snapshotBackupDirectory(snapshotRoot);
	if (!(await pathExists(backupDirectory))) return;
	if (await pathExists(snapshotRoot)) {
		await rm(backupDirectory, { recursive: true });
		return;
	}
	await rename(backupDirectory, snapshotRoot);
};

export const loadContentfulSnapshot = async (
	snapshotRoot: string | URL,
): Promise<ContentfulSnapshot> => {
	const root = toPath(snapshotRoot);
	await recoverSnapshotDirectory(root);
	return validateSnapshotDirectory(root);
};

export const swapSnapshotDirectory = async (
	stagedDirectory: string,
	snapshotRoot: string,
): Promise<void> => {
	await recoverSnapshotDirectory(snapshotRoot);
	const backupDirectory = snapshotBackupDirectory(snapshotRoot);
	await rename(snapshotRoot, backupDirectory);
	try {
		await rename(stagedDirectory, snapshotRoot);
	} catch (installError) {
		try {
			await rename(backupDirectory, snapshotRoot);
		} catch (rollbackError) {
			throw new AggregateError(
				[installError, rollbackError],
				`Unable to install the staged fixture or restore the previous fixture at ${backupDirectory}`,
			);
		}
		throw installError;
	}
	await rm(backupDirectory, { recursive: true });
};
