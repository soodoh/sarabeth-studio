import { ExternalLink, Play } from "lucide-react";
import { type JSX, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { YouTubePlaylistVideo } from "@/utils/types";

type VideoPlaylistProps = {
	playlistId: string;
	title: string;
	unavailableCount: number;
	videos: YouTubePlaylistVideo[];
};

const getEmbedUrl = (playlistId: string, videoId: string): string => {
	const parameters = new URLSearchParams({
		autoplay: "1",
		list: playlistId,
		playsinline: "1",
	});
	return `https://www.youtube-nocookie.com/embed/${videoId}?${parameters}`;
};

const getPlaylistUrl = (playlistId: string): string =>
	`https://www.youtube.com/playlist?list=${playlistId}`;

const getVideosWithKeys = (videos: YouTubePlaylistVideo[]) => {
	const occurrences = new Map<string, number>();
	return videos.map((video) => {
		const occurrence = (occurrences.get(video.id) ?? 0) + 1;
		occurrences.set(video.id, occurrence);
		return { key: `${video.id}-${occurrence}`, video };
	});
};

const VideoPlaylist = ({
	playlistId,
	title,
	unavailableCount,
	videos,
}: VideoPlaylistProps): JSX.Element => {
	const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
	const [isPlayerActive, setIsPlayerActive] = useState(false);
	const playerRef = useRef<HTMLIFrameElement>(null);
	const externalVideoRef = useRef<HTMLAnchorElement>(null);
	const activeVideoIndex = videos[selectedVideoIndex] ? selectedVideoIndex : 0;
	const selectedVideo = videos[activeVideoIndex];
	const videosWithKeys = getVideosWithKeys(videos);

	useEffect(() => {
		if (!isPlayerActive || !selectedVideo) return;
		if (selectedVideo.embeddable) playerRef.current?.focus();
		else externalVideoRef.current?.focus();
	}, [isPlayerActive, selectedVideo]);

	if (!selectedVideo) {
		return (
			<a
				href={getPlaylistUrl(playlistId)}
				target="_blank"
				rel="noreferrer"
				className="my-8 font-sans text-sm font-semibold underline underline-offset-4"
			>
				Open playlist on YouTube
			</a>
		);
	}

	const playVideo = (videoIndex: number): void => {
		setSelectedVideoIndex(videoIndex);
		setIsPlayerActive(true);
	};

	return (
		<section
			aria-label={`${title} video playlist`}
			className="mx-auto my-8 grid w-full max-w-[1200px] overflow-hidden bg-black shadow-lg md:aspect-[8/3] md:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]"
		>
			<div className="relative aspect-video min-w-0 bg-black md:aspect-auto md:h-full">
				{isPlayerActive && selectedVideo.embeddable ? (
					<iframe
						ref={playerRef}
						className="absolute inset-0 h-full w-full border-0"
						src={getEmbedUrl(playlistId, selectedVideo.id)}
						title={`YouTube video: ${selectedVideo.title}`}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					/>
				) : selectedVideo.embeddable ? (
					<Button
						variant="unstyled"
						size="unstyled"
						type="button"
						onClick={() => playVideo(activeVideoIndex)}
						className="group absolute inset-0 h-full w-full overflow-hidden rounded-none text-left text-white focus-visible:ring-inset"
						aria-label={`Play featured video: ${selectedVideo.title}`}
					>
						<img
							alt=""
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
							height="180"
							src={selectedVideo.thumbnailUrl}
							width="320"
						/>
						<span
							className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20"
							aria-hidden="true"
						/>
						<span className="absolute inset-0 flex items-center justify-center">
							<span className="flex size-20 items-center justify-center rounded-full bg-accent text-background shadow-lg transition-transform group-hover:scale-105">
								<Play className="ml-1 size-9 fill-current" aria-hidden="true" />
							</span>
						</span>
						<span className="absolute right-5 bottom-5 left-5 font-serif text-xl font-bold text-balance sm:text-2xl">
							{selectedVideo.title}
						</span>
					</Button>
				) : (
					<a
						ref={externalVideoRef}
						href={selectedVideo.watchUrl}
						target="_blank"
						rel="noreferrer"
						className="group absolute inset-0 block overflow-hidden text-left text-white focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[-2px]"
						aria-label={`Open video on YouTube: ${selectedVideo.title}`}
					>
						<img
							alt=""
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
							height="180"
							src={selectedVideo.thumbnailUrl}
							width="320"
						/>
						<span
							className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20"
							aria-hidden="true"
						/>
						<span className="absolute inset-0 flex items-center justify-center">
							<span className="flex size-20 items-center justify-center rounded-full bg-accent text-background shadow-lg transition-transform group-hover:scale-105">
								<ExternalLink className="size-8" aria-hidden="true" />
							</span>
						</span>
						<span className="absolute right-5 bottom-5 left-5 font-serif text-xl font-bold text-balance sm:text-2xl">
							{selectedVideo.title}
							<span className="mt-1 block font-sans text-xs font-semibold uppercase tracking-[0.12em]">
								Watch on YouTube
							</span>
						</span>
					</a>
				)}
			</div>

			<div className="flex max-h-[32rem] min-h-0 flex-col bg-background-light text-foreground md:h-full md:max-h-none">
				<div className="flex items-center justify-between gap-4 border-foreground/15 border-b px-5 py-4">
					<div>
						<h2 className="m-0 font-serif text-2xl leading-none">{title}</h2>
						<p className="mt-1 mb-0 font-sans text-xs uppercase tracking-[0.12em] text-foreground/70">
							YouTube playlist
						</p>
					</div>
					<span className="shrink-0 font-sans text-sm font-semibold">
						{videos.length} videos
						{unavailableCount > 0 ? (
							<span className="sr-only">, {unavailableCount} unavailable</span>
						) : null}
					</span>
				</div>

				<ol className="m-0 flex min-h-0 flex-1 list-none flex-col overflow-y-auto p-2">
					{videosWithKeys.map(({ key, video }, index) => {
						const isSelected = index === activeVideoIndex;
						return (
							<li key={key}>
								<Button
									variant="unstyled"
									size="unstyled"
									type="button"
									onClick={() => playVideo(index)}
									aria-current={isSelected ? "true" : undefined}
									aria-label={
										video.embeddable
											? `Play ${video.title}`
											: `Select ${video.title}; opens on YouTube`
									}
									className={cn(
										"grid w-full grid-cols-[8rem_minmax(0,1fr)] gap-3 rounded-md border border-transparent p-2 text-left whitespace-normal hover:bg-background focus-visible:ring-accent-dark/50",
										isSelected && "border-accent/50 bg-background",
									)}
								>
									<span className="relative aspect-video w-32 overflow-hidden bg-black">
										<img
											alt=""
											className="h-full w-full object-cover"
											height="180"
											loading="lazy"
											src={video.thumbnailUrl}
											width="320"
										/>
										<span className="absolute right-1 bottom-1 rounded-sm bg-black/85 px-1 py-0.5 font-sans text-[0.65rem] text-white">
											{video.duration}
										</span>
									</span>
									<span className="min-w-0 py-0.5">
										<span className="line-clamp-3 font-sans text-sm font-semibold leading-snug">
											{index + 1}. {video.title}
										</span>
										{isSelected ? (
											<span className="mt-1 block font-sans text-xs font-semibold text-accent-dark">
												Selected
											</span>
										) : null}
									</span>
								</Button>
							</li>
						);
					})}
				</ol>

				<a
					href={getPlaylistUrl(playlistId)}
					target="_blank"
					rel="noreferrer"
					className="flex items-center gap-2 border-foreground/15 border-t px-5 py-3 font-sans text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent-dark focus-visible:outline-offset-[-2px]"
				>
					<span
						className="size-2 rounded-full bg-[#ff0000]"
						aria-hidden="true"
					/>
					Open playlist on YouTube
				</a>
			</div>
		</section>
	);
};

export default VideoPlaylist;
