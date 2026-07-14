import type { Engagement } from "@/utils/types";

const endOfUtcDay = (value: string | Date): Date => {
	const date = new Date(value);
	date.setUTCHours(24, 0, 0, 0);
	return date;
};

export const getCurrentYear = (date: Date): number => date.getFullYear();

export const partitionEngagements = (
	engagements: readonly Engagement[],
	currentDate: Date,
): { upcoming: Engagement[]; past: Engagement[] } => {
	const today = endOfUtcDay(currentDate);
	const isUpcoming = (engagement: Engagement): boolean =>
		endOfUtcDay(engagement.endDate) >= today;
	const byEndDate = (left: Engagement, right: Engagement): number =>
		new Date(left.endDate).getTime() - new Date(right.endDate).getTime();

	return {
		upcoming: engagements.filter(isUpcoming).toSorted(byEndDate),
		past: engagements
			.filter((engagement) => !isUpcoming(engagement))
			.toSorted((left, right) => byEndDate(right, left)),
	};
};
