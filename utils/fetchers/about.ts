import {
	type ImageFormatter,
	requireFirstEntry,
} from "@/utils/contentful-assets";
import { decodeAboutData } from "@/utils/contentful-data";
import { type EntrySource, readEntry } from "@/utils/contentful-entry-source";

const getAboutData = async (
	entrySource: EntrySource,
	imageFormatter: ImageFormatter,
) => {
	const response = await entrySource.getEntries({ content_type: "about" });
	const entry = readEntry(requireFirstEntry(response.items, "about"), "about");
	return decodeAboutData({
		headshot: await imageFormatter(entry.fields.headshot, "about.headshot"),
		bio: entry.fields.bio,
		location: entry.fields.location,
	});
};

export default getAboutData;
