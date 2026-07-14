import { readRecord } from "@/utils/contentful-data";

export type EntryQuery = Readonly<Record<string, string | readonly string[]>>;

export interface EntrySource {
	getEntries(query: EntryQuery): Promise<{ items: readonly unknown[] }>;
}

export const readEntry = (value: unknown, path: string) => {
	const entry = readRecord(value, path);
	return {
		fields: readRecord(entry.fields, `${path}.fields`),
		sys: readRecord(entry.sys, `${path}.sys`),
	};
};

export const readEntryArray = (value: unknown, path: string): unknown[] => {
	if (!Array.isArray(value)) {
		throw new Error(`${path} must be an array`);
	}
	return value;
};
