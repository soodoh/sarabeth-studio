import type {
	AboutData,
	CommonData,
	ContactData,
	EngagementData,
	HomeData,
	LessonsData,
	MediaData,
} from "@/utils/types";

export interface DataProvider {
	getAboutData(): Promise<AboutData>;
	getCommonData(): Promise<CommonData>;
	getContactData(): Promise<ContactData>;
	getEngagementsData(): Promise<EngagementData>;
	getHomeData(): Promise<HomeData[]>;
	getLessonsData(): Promise<LessonsData>;
	getMediaData(): Promise<MediaData>;
}
