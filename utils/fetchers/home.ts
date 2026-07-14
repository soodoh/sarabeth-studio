import type { ImageFormatter } from "@/utils/contentful-assets";
import { decodeHomeData } from "@/utils/contentful-data";
import {
	type EntrySource,
	readEntry,
	readEntryArray,
} from "@/utils/contentful-entry-source";

const getHomeData = async (
	entrySource: EntrySource,
	imageFormatter: ImageFormatter,
) => {
	const response = await entrySource.getEntries({
		content_type: "home",
		order: ["fields.order"],
	});
	return Promise.all(
		response.items.map(async (value, index) => {
			const entry = readEntry(value, `home[${index}]`);
			return decodeHomeData(
				{
					id: entry.sys.id,
					mainSection: entry.fields.mainSection,
					title: entry.fields.title,
					description: entry.fields.description,
					subtitle: entry.fields.subtitle,
					buttonText: entry.fields.buttonText,
					buttonLink: entry.fields.buttonLink,
					images: await Promise.all(
						readEntryArray(
							entry.fields.images ?? [],
							`home[${index}].fields.images`,
						).map((image, imageIndex) =>
							imageFormatter(image, `home[${index}].images[${imageIndex}]`),
						),
					),
				},
				`home[${index}]`,
			);
		}),
	);
};

export default getHomeData;
