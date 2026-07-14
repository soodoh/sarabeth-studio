import { requireFirstEntry } from "@/utils/contentful-assets";
import { decodeCommonData } from "@/utils/contentful-data";
import { type EntrySource, readEntry } from "@/utils/contentful-entry-source";

const getCommonData = async (entrySource: EntrySource) => {
	const [aboutResponse, socialResponse] = await Promise.all([
		entrySource.getEntries({ content_type: "about" }),
		entrySource.getEntries({
			content_type: "socialMedia",
			order: ["fields.order"],
		}),
	]);
	const about = readEntry(
		requireFirstEntry(aboutResponse.items, "about"),
		"about",
	);
	return decodeCommonData({
		socialMediaLinks: socialResponse.items.map((value, index) => {
			const { fields } = readEntry(value, `socialMedia[${index}]`);
			return { source: fields.source, link: fields.link };
		}),
		location: about.fields.location,
		brandName: about.fields.title,
	});
};

export default getCommonData;
