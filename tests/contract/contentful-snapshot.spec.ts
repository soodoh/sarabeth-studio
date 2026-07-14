import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { createTestSnapshot } from "@/tests/support/snapshot-test-data";
import {
	loadContentfulSnapshot,
	swapSnapshotDirectory,
	validateSnapshotDirectory,
} from "@/utils/contentful-snapshot";
import type { ContentfulSnapshot } from "@/utils/types";

const temporaryRoots: string[] = [];
const webP = new TextEncoder().encode("RIFF\0\0\0\0WEBP");

const makeTemporaryRoot = async (): Promise<string> => {
	const root = await mkdtemp(path.join(os.tmpdir(), "contentful-snapshot-"));
	temporaryRoots.push(root);
	return root;
};

const writeFixture = async (
	directory: string,
	snapshot: ContentfulSnapshot = createTestSnapshot(),
): Promise<void> => {
	await mkdir(directory, { recursive: true });
	await Promise.all([
		writeFile(
			path.join(directory, "snapshot.json"),
			`${JSON.stringify(snapshot)}\n`,
		),
		writeFile(path.join(directory, "image-id.webp"), webP),
		writeFile(path.join(directory, "audio-id.wav"), "audio"),
		writeFile(path.join(directory, "audio-id-two.wav"), "audio"),
	]);
};

const snapshotNamed = (brandName: string): ContentfulSnapshot => ({
	...createTestSnapshot(),
	common: { ...createTestSnapshot().common, brandName },
});

test.afterEach(async () => {
	await Promise.all(
		temporaryRoots
			.splice(0)
			.map((root) => rm(root, { force: true, recursive: true })),
	);
});

test("validates a complete snapshot fixture", async () => {
	const root = await makeTemporaryRoot();
	const fixture = path.join(root, "fixture");
	await writeFixture(fixture);

	await expect(validateSnapshotDirectory(fixture)).resolves.toMatchObject({
		common: { brandName: "Sarabeth" },
	});
});

test("rejects malformed snapshots and invalid asset inventories", async () => {
	const root = await makeTemporaryRoot();
	const cases = [
		{
			name: "malformed-snapshot",
			mutate: (directory: string) =>
				writeFile(path.join(directory, "snapshot.json"), "not json"),
			message: /JSON/,
		},
		{
			name: "malformed-asset",
			mutate: (directory: string) =>
				writeFile(path.join(directory, "image-id.webp"), "not webp"),
			message: /WebP payload/,
		},
		{
			name: "missing",
			mutate: (directory: string) => rm(path.join(directory, "audio-id.wav")),
			message: /missing audio-id\.wav/,
		},
		{
			name: "unexpected",
			mutate: (directory: string) =>
				writeFile(path.join(directory, "obsolete.bin"), "obsolete"),
			message: /unexpected obsolete\.bin/,
		},
		{
			name: "empty",
			mutate: (directory: string) =>
				writeFile(path.join(directory, "audio-id.wav"), ""),
			message: /non-empty file: audio-id\.wav/,
		},
	];

	for (const invalidCase of cases) {
		const fixture = path.join(root, invalidCase.name);
		await writeFixture(fixture);
		await invalidCase.mutate(fixture);
		await expect(validateSnapshotDirectory(fixture)).rejects.toThrow(
			invalidCase.message,
		);
	}
});

test("installs a staged fixture and removes the prior fixture and backup", async () => {
	const root = await makeTemporaryRoot();
	const fixture = path.join(root, "contentful");
	const staged = path.join(root, "staged");
	await writeFixture(fixture, snapshotNamed("old"));
	await writeFixture(staged, snapshotNamed("new"));

	await swapSnapshotDirectory(staged, fixture);

	await expect(loadContentfulSnapshot(fixture)).resolves.toMatchObject({
		common: { brandName: "new" },
	});
	await expect(rm(staged)).rejects.toMatchObject({ code: "ENOENT" });
	await expect(rm(`${fixture}.backup`)).rejects.toMatchObject({
		code: "ENOENT",
	});
});

test("restores the prior fixture when staged installation fails", async () => {
	const root = await makeTemporaryRoot();
	const fixture = path.join(root, "contentful");
	await writeFixture(fixture, snapshotNamed("old"));

	await expect(
		swapSnapshotDirectory(path.join(root, "missing-staged"), fixture),
	).rejects.toThrow();

	await expect(loadContentfulSnapshot(fixture)).resolves.toMatchObject({
		common: { brandName: "old" },
	});
	await expect(rm(`${fixture}.backup`)).rejects.toMatchObject({
		code: "ENOENT",
	});
});

test("recovers interrupted and stale backups before later reads or replacements", async () => {
	const root = await makeTemporaryRoot();
	const fixture = path.join(root, "contentful");
	const backup = `${fixture}.backup`;
	await writeFixture(fixture, snapshotNamed("interrupted"));
	await rename(fixture, backup);

	await expect(loadContentfulSnapshot(fixture)).resolves.toMatchObject({
		common: { brandName: "interrupted" },
	});
	await expect(rm(backup)).rejects.toMatchObject({ code: "ENOENT" });

	await writeFixture(backup, snapshotNamed("stale"));
	const staged = path.join(root, "staged");
	await writeFixture(staged, snapshotNamed("replacement"));
	await swapSnapshotDirectory(staged, fixture);

	await expect(loadContentfulSnapshot(fixture)).resolves.toMatchObject({
		common: { brandName: "replacement" },
	});
	await expect(rm(backup)).rejects.toMatchObject({ code: "ENOENT" });
});
