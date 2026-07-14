import {
	type ImageFormatter,
	requireFirstEntry,
} from "@/utils/contentful-assets";
import { decodeContactData } from "@/utils/contentful-data";
import { type EntrySource, readEntry } from "@/utils/contentful-entry-source";

const getContactData = async (
	entrySource: EntrySource,
	imageFormatter: ImageFormatter,
) => {
	const response = await entrySource.getEntries({ content_type: "contact" });
	const entry = readEntry(
		requireFirstEntry(response.items, "contact"),
		"contact",
	);
	return decodeContactData({
		bannerImage: await imageFormatter(
			entry.fields.bannerImage,
			"contact.bannerImage",
		),
	});
};

export default getContactData;
