import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react";
import BannerImage from "@/components/banner-image";
import EngagementsTable from "@/components/engagements-table";
import WidthContainer from "@/components/width-container";
import { fetchEngagementsData } from "@/utils/server-functions";
import { partitionEngagements } from "@/utils/temporal-data";
import { useCurrentDateKey } from "@/utils/use-current-date";

export const Route = createFileRoute("/engagements")({
	loader: () => fetchEngagementsData(),
	staleTime: Number.POSITIVE_INFINITY,
	head: () => ({
		meta: [
			{ title: "Sarabeth's Engagements" },
			{
				name: "description",
				content:
					"Young and talented female opera singer, Sarabeth Belon, captivates audiences throughout the country. Learn more about her current and upcoming engagements!",
			},
			{ name: "keywords", content: "sarabeth belon engagements" },
		],
	}),
	component: EngagementsPage,
});

function EngagementsPage(): JSX.Element {
	const { bannerImage, engagements, renderedAt, title } = Route.useLoaderData();
	const currentDate = useCurrentDateKey(renderedAt);
	const { past, upcoming } = partitionEngagements(
		engagements,
		new Date(`${currentDate}T12:00:00.000Z`),
	);

	return (
		<>
			<BannerImage image={bannerImage} title={title} />
			<WidthContainer className="flex flex-col items-center justify-center">
				{upcoming.length > 0 ? (
					<EngagementsTable engagements={upcoming} label="Upcoming" />
				) : null}
				{past.length > 0 ? (
					<EngagementsTable engagements={past} label="Past" />
				) : null}
			</WidthContainer>
		</>
	);
}
