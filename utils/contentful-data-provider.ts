import type { ImageFormatter } from "@/utils/contentful-assets";
import type { EntrySource } from "@/utils/contentful-entry-source";
import type { DataProvider } from "@/utils/data-provider";
import getAboutData from "@/utils/fetchers/about";
import getCommonData from "@/utils/fetchers/common";
import getContactData from "@/utils/fetchers/contact";
import getEngagementsData from "@/utils/fetchers/engagements";
import getHomeData from "@/utils/fetchers/home";
import getLessonsData from "@/utils/fetchers/lessons";
import getMediaData from "@/utils/fetchers/media";

type ContentfulDataProviderOptions = {
	entrySource: EntrySource;
	imageFormatter: ImageFormatter;
};

export const createContentfulDataProvider = ({
	entrySource,
	imageFormatter,
}: ContentfulDataProviderOptions): DataProvider => ({
	getAboutData: () => getAboutData(entrySource, imageFormatter),
	getCommonData: () => getCommonData(entrySource),
	getContactData: () => getContactData(entrySource, imageFormatter),
	getEngagementsData: () => getEngagementsData(entrySource, imageFormatter),
	getHomeData: () => getHomeData(entrySource, imageFormatter),
	getLessonsData: () => getLessonsData(entrySource, imageFormatter),
	getMediaData: () => getMediaData(entrySource, imageFormatter),
});
