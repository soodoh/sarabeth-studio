import { client } from "@/utils/contentful";
import type { EntrySource } from "@/utils/contentful-entry-source";

export const contentfulEntrySource: EntrySource = {
	getEntries: async (query) => {
		const response = await client.getEntries(query);
		return { items: response.items };
	},
};
