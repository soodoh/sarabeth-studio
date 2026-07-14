import {
	formatAsset,
	type ImageFormatter,
	requireFirstEntry,
} from "@/utils/contentful-assets";
import { decodeMediaData } from "@/utils/contentful-data";
import {
	type EntrySource,
	readEntry,
	readEntryArray,
} from "@/utils/contentful-entry-source";

const getMediaData = async (
	entrySource: EntrySource,
	imageFormatter: ImageFormatter,
) => {
	const response = await entrySource.getEntries({ content_type: "mediaPage" });
	const entry = readEntry(
		requireFirstEntry(response.items, "mediaPage"),
		"mediaPage",
	);
	return decodeMediaData({
		images: await Promise.all(
			readEntryArray(entry.fields.images, "mediaPage.fields.images").map(
				(image, index) => imageFormatter(image, `media.images[${index}]`),
			),
		),
		audio: readEntryArray(entry.fields.audio, "mediaPage.fields.audio").map(
			(audio, index) => formatAsset(audio, `media.audio[${index}]`),
		),
	});
};

export default getMediaData;
