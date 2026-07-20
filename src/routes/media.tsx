import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react";
import AudioPlayer from "@/components/audio-player";
import PhotoCarousel from "@/components/photo-carousel";
import TextHeading from "@/components/text-heading";
import VideoPlaylistLoader from "@/components/video-playlist-loader";
import WidthContainer from "@/components/width-container";
import { fetchMediaData } from "@/utils/server-functions";

export const Route = createFileRoute("/media")({
	loader: () => fetchMediaData(),
	staleTime: Number.POSITIVE_INFINITY,
	head: () => ({
		meta: [
			{ title: "Sarabeth's Recordings & Photos" },
			{
				name: "description",
				content:
					"Sarabeth Belón's media page: recordings, photos and videos. Listen to recordings of her opera arias and art songs. Clips of her performances are also available. View pictures from past performances, professional headshots and more. Photo credits included when viewing higher resolution images.",
			},
			{
				name: "keywords",
				content: "sarabeth belon media, sarabeth belon recordings",
			},
		],
	}),
	component: MediaPage,
});

function MediaPage(): JSX.Element {
	const { images, audio } = Route.useLoaderData();

	return (
		<div className="flex flex-col items-center">
			<TextHeading text="Photos" />
			<PhotoCarousel images={images} />

			<TextHeading text="Videos" />
			<VideoPlaylistLoader />

			<TextHeading text="Audio" />
			<WidthContainer>
				{audio.map((audioFile) => (
					<div className="my-8" key={audioFile.id}>
						<div className="my-2 flex items-center">
							<h2 className="m-0 mr-8 font-sans text-base">
								{audioFile.title}
							</h2>
							<span className="font-sans">{audioFile.description}</span>
						</div>
						<AudioPlayer source={audioFile.url} title={audioFile.title} />
					</div>
				))}
			</WidthContainer>
		</div>
	);
}
