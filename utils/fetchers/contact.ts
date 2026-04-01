import type { Asset as ContentfulAsset, EntrySkeletonType } from "contentful";
import { client, formatImage } from "@/utils/contentful";
import type { ContactData } from "@/utils/types";

type ContactFields = {
	bannerImage: ContentfulAsset;
};

type ContactSkeleton = EntrySkeletonType<ContactFields, "contact">;

const getContactData = async (): Promise<ContactData> => {
	const contactEntries = await client.getEntries<ContactSkeleton>({
		content_type: "contact",
	});
	const contactResponse = contactEntries.items[0]?.fields;

	return {
		bannerImage: await formatImage(
			contactResponse?.bannerImage as ContentfulAsset,
		),
	};
};

export default getContactData;
