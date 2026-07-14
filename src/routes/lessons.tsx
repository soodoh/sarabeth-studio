import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react";
import BannerImage from "@/components/banner-image";
import LessonsPageContent from "@/components/lessons-page-content";
import { fetchLessonsData } from "@/utils/server-functions";

export const Route = createFileRoute("/lessons")({
	loader: () => fetchLessonsData(),
	staleTime: Number.POSITIVE_INFINITY,
	head: () => ({
		meta: [
			{ title: "Singing Lessons | Los Angeles" },
			{
				name: "description",
				content:
					"Offering the very best singing lessons in Los Angeles. Refine your voice, sing with ease, and perfect your craft. Book your lesson now!",
			},
			{
				name: "keywords",
				content:
					"singing lessons los angeles, voice lessons los angeles, singing coach los angeles",
			},
		],
	}),
	component: LessonsPage,
});

function LessonsPage(): JSX.Element {
	const lessonsData = Route.useLoaderData();

	return (
		<>
			<BannerImage image={lessonsData.bannerImage} title={lessonsData.title} />
			<LessonsPageContent lessonsData={lessonsData} />
		</>
	);
}
