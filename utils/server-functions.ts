import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { dataProvider } from "@/utils/data-provider.server";
import { getCurrentDate } from "@/utils/get-current-date.server";

export const fetchCommonData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(async () => {
		const commonData = await dataProvider.getCommonData();
		return {
			...commonData,
			renderedAt: getCurrentDate().toISOString(),
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
	.handler(async () => ({
		...(await dataProvider.getEngagementsData()),
		renderedAt: getCurrentDate().toISOString(),
	}));

export const fetchLessonsData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(() => dataProvider.getLessonsData());

export const fetchMediaData = createServerFn()
	.middleware([staticFunctionMiddleware])
	.handler(() => dataProvider.getMediaData());
