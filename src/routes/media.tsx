import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { type JSX, useEffect, useRef, useState } from "react";
import AudioPlayer from "@/components/audio-player";
import PhotoCarousel from "@/components/photo-carousel";
import TextHeading from "@/components/text-heading";
import { Button } from "@/components/ui/button";
import WidthContainer from "@/components/width-container";
import { fetchMediaData } from "@/utils/server-functions";

const playlistId = "PL2ucJM2n3hm_c0L7-_dAnJ_Kajde66Id1";
const playlistEmbedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
const playlistPageUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

const VideoPlaylist = (): JSX.Element => {
	const [isActive, setIsActive] = useState(false);
	const playerRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		if (isActive) playerRef.current?.focus();
	}, [isActive]);

	return (
		<div className="mx-auto mt-4 mb-8 w-full max-w-[1200px]">
			<div className="relative h-[35rem] bg-black max-sm:h-[20rem] [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full">
				{isActive ? (
					<iframe
						ref={playerRef}
						src={playlistEmbedUrl}
						title="YouTube video playlist"
						style={{ border: 0 }}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				) : (
					<Button
						variant="unstyled"
						size="unstyled"
						type="button"
						onClick={() => setIsActive(true)}
						className="absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-none border-0 bg-black text-background hover:bg-black hover:text-background"
					>
						<Play className="size-16 fill-current" aria-hidden="true" />
						<span className="font-sans text-lg font-bold uppercase">
							Load video playlist
						</span>
					</Button>
				)}
			</div>
			<a
				href={playlistPageUrl}
				target="_blank"
				rel="noreferrer"
				className="mt-3 inline-block font-sans text-sm font-semibold text-foreground underline underline-offset-4"
			>
				Open playlist on YouTube
			</a>
		</div>
	);
};

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
			<VideoPlaylist />

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
