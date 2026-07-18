import {
	type ImageFormatter,
	requireFirstEntry,
} from "@/utils/contentful-assets";
import { decodeLessonsData } from "@/utils/contentful-data";
import { type EntrySource, readEntry } from "@/utils/contentful-entry-source";

const getLessonsData = async (
	entrySource: EntrySource,
	imageFormatter: ImageFormatter,
) => {
	const response = await entrySource.getEntries({ content_type: "lessons" });
	const entry = readEntry(
		requireFirstEntry(response.items, "lessons"),
		"lessons",
	);
	const fields = entry.fields;
	const [bannerImage, socialMediaImage] = await Promise.all([
		imageFormatter(fields.bannerImage, "lessons.bannerImage"),
		imageFormatter(fields.socialMediaImage, "lessons.socialMediaImage"),
	]);
	return decodeLessonsData({
		title: fields.title,
		bannerImage,
		aboutDescription: fields.aboutDescription,
		teachingPhilosophy: fields.teachingPhilosophy,
		studioExpectations: fields.studioExpectations,
		socialMediaDescription: fields.socialMediaDescription,
		socialMediaImage,
		teachingResume: fields.teachingResume,
		reviewLink: fields.reviewLink,
		phoneNumber: fields.phoneNumber,
		email: fields.email,
		followLink: fields.followLink,
	});
};

export default getLessonsData;
