import { getContentfulClient } from "@/utils/contentful";
import type { EntrySource } from "@/utils/contentful-entry-source";

export const contentfulEntrySource: EntrySource = {
	getEntries: async (query) => {
		const response = await getContentfulClient().getEntries(query);
		return { items: response.items };
	},
};
