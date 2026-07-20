import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react";
import StyledImage from "@/components/styled-image";
import WidthContainer from "@/components/width-container";
import { fetchAboutData } from "@/utils/server-functions";

export const Route = createFileRoute("/about")({
	loader: () => fetchAboutData(),
	staleTime: Number.POSITIVE_INFINITY,
	head: () => ({
		meta: [
			{ title: "About Sarabeth" },
			{
				name: "description",
				content:
					"Offering the very best private vocal lessons in Los Angeles. Refine your voice, achieve constant flow of breadth, and sing with ease.",
			},
			{
				name: "keywords",
				content: "vocal lessons los angeles, piano teacher los angeles",
			},
		],
	}),
	component: AboutPage,
});

function AboutPage(): JSX.Element {
	const { headshot, bio } = Route.useLoaderData();

	return (
		<WidthContainer className="mb-16 grid grid-cols-[30%_1fr] gap-16 max-sm:grid-cols-1">
			<div className="max-sm:max-w-[300px]">
				<StyledImage
					overlayDirection="right"
					image={headshot}
					priority
					sizes="(max-width: 379px) calc(100vw - 5rem), (max-width: 699px) 300px, (max-width: 1199px) 30vw, 336px"
				/>
			</div>
			<div className="leading-7 [&_h1]:text-[3rem] [&_h1]:leading-[3.5rem] [&_p]:mb-8">
				{documentToReactComponents(bio)}
			</div>
		</WidthContainer>
	);
}
