import { access, readFile } from "node:fs/promises";
import path from "node:path";
import {
	assertContentfulSnapshot,
	collectSnapshotAssets,
	contentfulSnapshotVersionPattern,
	isRecord,
} from "@/utils/contentful-snapshot-schema";
import type { ContentfulSnapshot } from "@/utils/types";

const snapshotRoot = path.join(process.cwd(), "public", "contentful-snapshot");
const manifestPath = path.join(snapshotRoot, "manifest.json");

const readJson = async (filePath: string): Promise<unknown> => {
	const source = await readFile(filePath, "utf8");
	return JSON.parse(source);
};

const readSnapshotVersion = async (): Promise<string> => {
	const manifest = await readJson(manifestPath);
	if (
		!isRecord(manifest) ||
		typeof manifest.version !== "string" ||
		!contentfulSnapshotVersionPattern.test(manifest.version)
	) {
		throw new Error("Invalid Contentful snapshot manifest");
	}
	return manifest.version;
};

export const loadContentfulSnapshot = async (): Promise<ContentfulSnapshot> => {
	const version = await readSnapshotVersion();
	const snapshotDirectory = path.join(snapshotRoot, version);
	const snapshot = await readJson(
		path.join(snapshotDirectory, "snapshot.json"),
	);
	assertContentfulSnapshot(snapshot);

	const publicAssetPrefix = `/contentful-snapshot/${version}/`;
	const assetPaths = new Set(
		collectSnapshotAssets(snapshot).map(({ url }) => {
			if (!url.startsWith(publicAssetPrefix)) {
				throw new Error(`Contentful snapshot contains external asset: ${url}`);
			}
			const filename = url.slice(publicAssetPrefix.length);
			if (!filename || path.basename(filename) !== filename) {
				throw new Error(
					`Contentful snapshot contains an invalid asset path: ${url}`,
				);
			}
			return path.join(snapshotDirectory, filename);
		}),
	);

	await Promise.all([...assetPaths].map((assetPath) => access(assetPath)));
	return snapshot;
};
