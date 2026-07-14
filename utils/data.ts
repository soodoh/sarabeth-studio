import { cache } from "react";
import { loadContentfulSnapshot } from "@/utils/contentful-snapshot";
import getLiveAboutData from "@/utils/fetchers/about";
import getLiveCommonData from "@/utils/fetchers/common";
import getLiveContactData from "@/utils/fetchers/contact";
import getLiveEngagementsData from "@/utils/fetchers/engagements";
import getLiveHomeData from "@/utils/fetchers/home";
import getLiveLessonsData from "@/utils/fetchers/lessons";
import getLiveMediaData from "@/utils/fetchers/media";
import type { ContentfulSnapshot } from "@/utils/types";

const contentfulSnapshotEnabled =
	process.env.CONTENTFUL_USE_SNAPSHOT === "true";
const getContentfulSnapshot = cache(loadContentfulSnapshot);

const getData = async <Key extends keyof ContentfulSnapshot>(
	key: Key,
	getLiveData: () => Promise<ContentfulSnapshot[Key]>,
): Promise<ContentfulSnapshot[Key]> => {
	if (!contentfulSnapshotEnabled) {
		return getLiveData();
	}
	const snapshot = await getContentfulSnapshot();
	return snapshot[key];
};

export const getAboutData = () => getData("about", getLiveAboutData);
export const getCommonData = () => getData("common", getLiveCommonData);
export const getContactData = () => getData("contact", getLiveContactData);
export const getEngagementsData = () =>
	getData("engagements", getLiveEngagementsData);
export const getHomeData = () => getData("home", getLiveHomeData);
export const getLessonsData = () => getData("lessons", getLiveLessonsData);
export const getMediaData = () => getData("media", getLiveMediaData);
