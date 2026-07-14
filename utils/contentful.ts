import { createClient } from "contentful";
import { createImageFormatter } from "@/utils/contentful-assets";
import { getPlaceholder } from "./image.server";

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
	throw new Error("Missing Contentful environment variables");
}

export const client = createClient({
	space,
	accessToken,
}).withoutUnresolvableLinks;
export const formatImage = createImageFormatter(getPlaceholder);
export type { ImageFormatter } from "@/utils/contentful-assets";
export {
	createImageFormatter,
	formatAsset,
	formatUrl,
	requireFirstEntry,
} from "@/utils/contentful-assets";
