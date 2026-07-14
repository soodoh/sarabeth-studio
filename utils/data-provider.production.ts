import { formatImage } from "@/utils/contentful";
import { createContentfulDataProvider } from "@/utils/contentful-data-provider";
import { contentfulEntrySource } from "@/utils/contentful-entry-source.server";
import type { DataProvider } from "@/utils/data-provider";

export const dataProvider: DataProvider = createContentfulDataProvider({
	entrySource: contentfulEntrySource,
	imageFormatter: formatImage,
});
