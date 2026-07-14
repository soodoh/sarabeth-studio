import path from "node:path";
import { loadContentfulSnapshot } from "@/utils/contentful-snapshot";
import type { DataProvider } from "@/utils/data-provider";
import type { ContentfulSnapshot } from "@/utils/types";

const snapshotRoot = path.join(
	process.cwd(),
	"tests",
	"fixtures",
	"contentful",
);
let snapshotPromise: Promise<ContentfulSnapshot> | undefined;

const snapshot = () => {
	snapshotPromise ??= loadContentfulSnapshot(snapshotRoot);
	return snapshotPromise;
};

const get = async <Key extends keyof ContentfulSnapshot>(key: Key) =>
	(await snapshot())[key];

export const dataProvider: DataProvider = {
	getAboutData: () => get("about"),
	getCommonData: () => get("common"),
	getContactData: () => get("contact"),
	getEngagementsData: () => get("engagements"),
	getHomeData: () => get("home"),
	getLessonsData: () => get("lessons"),
	getMediaData: () => get("media"),
};
