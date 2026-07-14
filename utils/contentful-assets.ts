import {
	type ContentfulAssetKind,
	validateContentfulAssetUrl,
} from "@/utils/contentful-asset-url";
import { decodeAsset, decodeImage, readRecord } from "@/utils/contentful-data";
import type { Asset, ImageType } from "@/utils/types";

const requiredString = (value: unknown, path: string): string => {
	if (typeof value !== "string" || value.length === 0) {
		throw new Error(`${path} must be a non-empty string`);
	}
	return value;
};

export const formatUrl = (
	value: unknown,
	path = "asset.fields.file.url",
	kind: ContentfulAssetKind = "asset",
): string => {
	const source = requiredString(value, path);
	if (!source.startsWith("//") || source.startsWith("///")) {
		throw new Error(`${path} must be a Contentful protocol-relative URL`);
	}
	const formatted = `https:${source}`;
	validateContentfulAssetUrl(formatted, kind);
	return formatted;
};

const readRawAsset = (
	value: unknown,
	path: string,
	kind: ContentfulAssetKind = "asset",
) => {
	const raw = readRecord(value, path);
	const sys = readRecord(raw.sys, `${path}.sys`);
	const fields = readRecord(raw.fields, `${path}.fields`);
	const file = readRecord(fields.file, `${path}.fields.file`);
	return {
		id: requiredString(sys.id, `${path}.sys.id`),
		title: requiredString(fields.title, `${path}.fields.title`),
		description:
			typeof fields.description === "string" ? fields.description : "",
		url: formatUrl(file.url, `${path}.fields.file.url`, kind),
		details: readRecord(file.details, `${path}.fields.file.details`),
	};
};

export function formatAsset(value: unknown, path = "asset"): Asset {
	return decodeAsset(readRawAsset(value, path), path);
}

export type ImageFormatter = (
	value: unknown,
	path?: string,
) => Promise<ImageType>;

export const createImageFormatter = (
	loadPlaceholder: (url: string) => Promise<string>,
): ImageFormatter => {
	const cache = new Map<
		string,
		{ metadata: string; image: Promise<ImageType> }
	>();
	return async (value, path = "image") => {
		const raw = readRawAsset(value, path, "image");
		const imageDetails = readRecord(
			raw.details.image,
			`${path}.fields.file.details.image`,
		);
		const candidate = {
			id: raw.id,
			title: raw.title,
			description: raw.description,
			url: raw.url,
			width: imageDetails.width,
			height: imageDetails.height,
		};
		const metadata = JSON.stringify(candidate);
		const cached = cache.get(raw.id);
		if (cached?.metadata === metadata) return cached.image;

		const image = loadPlaceholder(raw.url).then((placeholder) =>
			decodeImage({ ...candidate, placeholder }, path),
		);
		const entry = { metadata, image };
		cache.set(raw.id, entry);
		try {
			return await image;
		} catch (error) {
			if (cache.get(raw.id) === entry) cache.delete(raw.id);
			throw error;
		}
	};
};

export const requireFirstEntry = <T>(
	items: readonly T[],
	contentType: string,
): T => {
	const entry = items[0];
	if (!entry) throw new Error(`Contentful returned no ${contentType} entry`);
	return entry;
};
