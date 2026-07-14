import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { BrowserContext, Route } from "@playwright/test";
import {
	contentfulAssetHost,
	contentfulDownloadHost,
	contentfulImageHost,
} from "@/utils/contentful-asset-url";
import { getSnapshotAudio, getSnapshotImages } from "@/utils/contentful-data";
import {
	contentfulAssetFilename,
	loadContentfulSnapshot,
} from "@/utils/contentful-snapshot";

const fixtureRoot = fileURLToPath(
	new URL("../fixtures/contentful/", import.meta.url),
);

type AudioRange =
	| { status: 200; start: 0; end: number }
	| { status: 206; start: number; end: number }
	| { status: 416 };

export const parseAudioRange = (
	range: string | undefined,
	size: number,
): AudioRange => {
	if (range === undefined) return { status: 200, start: 0, end: size - 1 };
	const match = /^bytes=(\d*)-(\d*)$/.exec(range);
	if (!match || (match[1] === "" && match[2] === "")) return { status: 416 };
	if (match[1] === "") {
		const suffix = Number(match[2]);
		if (!Number.isSafeInteger(suffix) || suffix <= 0) return { status: 416 };
		return { status: 206, start: Math.max(0, size - suffix), end: size - 1 };
	}
	const start = Number(match[1]);
	const requestedEnd = match[2] === "" ? size - 1 : Number(match[2]);
	if (
		!Number.isSafeInteger(start) ||
		!Number.isSafeInteger(requestedEnd) ||
		start >= size ||
		start > requestedEnd
	) {
		return { status: 416 };
	}
	return { status: 206, start, end: Math.min(requestedEnd, size - 1) };
};

const baseUrl = (source: string): string => {
	const url = new URL(source);
	return `${url.origin}${url.pathname}`;
};

export const installContentfulRoutes = async (
	context: BrowserContext,
): Promise<void> => {
	const snapshot = await loadContentfulSnapshot(fixtureRoot);
	const directory = fixtureRoot;
	const imagePaths = new Map<string, string>();
	const audioPaths = new Map<string, string>();
	for (const image of getSnapshotImages(snapshot)) {
		imagePaths.set(
			baseUrl(image.url),
			path.join(directory, contentfulAssetFilename(image, "image")),
		);
	}
	for (const audio of getSnapshotAudio(snapshot)) {
		audioPaths.set(
			baseUrl(audio.url),
			path.join(directory, contentfulAssetFilename(audio, "asset")),
		);
	}

	await context.route(`https://${contentfulImageHost}/**`, async (route) => {
		const filePath = imagePaths.get(baseUrl(route.request().url()));
		if (!filePath) {
			await route.abort("failed");
			return;
		}
		await route.fulfill({
			body: await readFile(filePath),
			contentType: "image/webp",
		});
	});

	const fulfillAudio = async (route: Route): Promise<void> => {
		const filePath = audioPaths.get(baseUrl(route.request().url()));
		if (!filePath) {
			await route.abort("failed");
			return;
		}
		const bytes = await readFile(filePath);
		const range = parseAudioRange(
			route.request().headers().range,
			bytes.byteLength,
		);
		const headers: Record<string, string> = {
			"Accept-Ranges": "bytes",
			"Content-Type": "audio/wav",
		};
		if (range.status === 416) {
			headers["Content-Range"] = `bytes */${bytes.byteLength}`;
			headers["Content-Length"] = "0";
			await route.fulfill({ status: 416, headers });
			return;
		}
		const body = bytes.subarray(range.start, range.end + 1);
		headers["Content-Length"] = `${body.byteLength}`;
		if (range.status === 206) {
			headers["Content-Range"] =
				`bytes ${range.start}-${range.end}/${bytes.byteLength}`;
		}
		await route.fulfill({
			status: range.status,
			headers,
			body: route.request().method() === "HEAD" ? undefined : body,
		});
	};
	for (const host of [contentfulAssetHost, contentfulDownloadHost]) {
		await context.route(`https://${host}/**`, fulfillAudio);
	}
};
