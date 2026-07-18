import { createClient } from "contentful";
import { createImageFormatter } from "@/utils/contentful-assets";
import { getPlaceholder } from "@/utils/image.server";

type ContentfulClient = ReturnType<
	typeof createClient
>["withoutUnresolvableLinks"];

let client: ContentfulClient | undefined;

export const getContentfulClient = (): ContentfulClient => {
	if (client) return client;

	const space = process.env.CONTENTFUL_SPACE_ID;
	const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
	if (!space || !accessToken) {
		throw new Error("Missing Contentful build environment variables");
	}

	client = createClient({
		space,
		accessToken,
	}).withoutUnresolvableLinks;
	return client;
};
export const formatImage = createImageFormatter(getPlaceholder);
export type { ImageFormatter } from "@/utils/contentful-assets";
export {
	createImageFormatter,
	formatAsset,
	formatUrl,
	requireFirstEntry,
} from "@/utils/contentful-assets";
