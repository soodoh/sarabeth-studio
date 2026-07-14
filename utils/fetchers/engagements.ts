import {
	type ImageFormatter,
	requireFirstEntry,
} from "@/utils/contentful-assets";
import { decodeEngagementData } from "@/utils/contentful-data";
import { type EntrySource, readEntry } from "@/utils/contentful-entry-source";

const getEngagementsData = async (
	entrySource: EntrySource,
	imageFormatter: ImageFormatter,
) => {
	const [pageResponse, engagementsResponse] = await Promise.all([
		entrySource.getEntries({ content_type: "engagementsPage" }),
		entrySource.getEntries({ content_type: "engagements" }),
	]);
	const page = readEntry(
		requireFirstEntry(pageResponse.items, "engagementsPage"),
		"engagementsPage",
	);
	return decodeEngagementData({
		title: page.fields.title,
		bannerImage: await imageFormatter(
			page.fields.banner,
			"engagements.bannerImage",
		),
		engagements: engagementsResponse.items.map((value, index) => {
			const entry = readEntry(value, `engagements[${index}]`);
			return {
				id: entry.sys.id,
				title: entry.fields.label,
				role: entry.fields.role,
				company: entry.fields.company,
				link: entry.fields.link,
				startDate: entry.fields.startDate,
				endDate: entry.fields.endDate,
			};
		}),
	});
};

export default getEngagementsData;
