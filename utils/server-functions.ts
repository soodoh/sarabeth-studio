import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { dataProvider } from "@/utils/data-provider.server";
import { getCurrentDate } from "@/utils/get-current-date.server";
import { getCurrentYear, partitionEngagements } from "@/utils/temporal-data";

export const fetchCommonData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(async () => {
		const commonData = await dataProvider.getCommonData();
		return {
			...commonData,
			currentYear: getCurrentYear(getCurrentDate()),
		};
	});

export const fetchHomeData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(() => dataProvider.getHomeData());

export const fetchAboutData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(() => dataProvider.getAboutData());

export const fetchContactData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(() => dataProvider.getContactData());

export const fetchEngagementsData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(async () => {
		const { engagements, ...pageData } =
			await dataProvider.getEngagementsData();
		return {
			...pageData,
			...partitionEngagements(engagements, getCurrentDate()),
		};
	});

export const fetchLessonsData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(() => dataProvider.getLessonsData());

export const fetchMediaData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(() => dataProvider.getMediaData());
