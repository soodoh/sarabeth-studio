import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react";
import HomeContent from "@/components/home-content";
import { fetchHomeData } from "@/utils/server-functions";

export const Route = createFileRoute("/")({
	loader: () => fetchHomeData(),
	staleTime: Number.POSITIVE_INFINITY,
	head: () => ({
		meta: [
			{ title: "Sarabeth Belón: Portfolio" },
			{
				name: "description",
				content:
					"Sarabeth Belon, a young female opera singer, captivates audiences with her tessitura and repertoire versatility. Learn more about this artist!",
			},
			{
				name: "keywords",
				content: "young female opera singer, opera singer los angeles",
			},
		],
	}),
	component: HomePage,
});

function HomePage(): JSX.Element {
	const homeData = Route.useLoaderData();
	return <HomeContent homeData={homeData} />;
}
