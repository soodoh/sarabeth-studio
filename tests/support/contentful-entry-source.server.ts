import { contentfulEntryFixture } from "@/tests/support/contentful-entry-fixture";
import type { EntrySource } from "@/utils/contentful-entry-source";

export const contentfulEntrySource: EntrySource = {
	getEntries: async (query) => {
		const contentType = query.content_type;
		if (typeof contentType !== "string") {
			throw new Error("content_type must be a string");
		}
		return { items: contentfulEntryFixture[contentType] ?? [] };
	},
};
