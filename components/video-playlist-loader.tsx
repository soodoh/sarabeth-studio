import { type JSX, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import VideoPlaylist from "@/components/video-playlist";
import type { YouTubePlaylist } from "@/utils/types";
import {
	getYouTubePlaylistUrl,
	youtubePlaylistId,
} from "@/utils/youtube-playlist-config";
import { decodeYouTubePlaylist } from "@/utils/youtube-playlist-data";

type PlaylistState =
	| { status: "loading"; attempt: number }
	| { status: "success"; playlist: YouTubePlaylist }
	| { status: "error" };

const PlaylistLoading = (): JSX.Element => (
	<section
		aria-label="Loading YouTube playlist"
		aria-live="polite"
		className="mx-auto my-8 grid w-full max-w-[1200px] overflow-hidden bg-black shadow-lg md:aspect-[8/3] md:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]"
	>
		<div className="aspect-video animate-pulse bg-foreground/20 md:aspect-auto md:h-full" />
		<div className="flex h-[32rem] flex-col gap-4 bg-background-light p-5 md:h-full">
			<span className="sr-only">Loading videos</span>
			<div className="h-8 w-2/3 animate-pulse rounded bg-foreground/15" />
			<div className="h-20 animate-pulse rounded bg-foreground/10" />
			<div className="h-20 animate-pulse rounded bg-foreground/10" />
			<div className="h-20 animate-pulse rounded bg-foreground/10" />
		</div>
	</section>
);

const PlaylistError = ({ retry }: { retry: () => void }): JSX.Element => (
	<section
		aria-label="YouTube playlist unavailable"
		className="mx-auto my-8 grid w-full max-w-[1200px] overflow-hidden bg-black shadow-lg md:block md:aspect-[8/3]"
	>
		<div className="aspect-video bg-black md:hidden" aria-hidden="true" />
		<div className="flex h-[32rem] flex-col items-center justify-center gap-4 bg-background-light px-6 text-center md:h-full">
			<div role="alert">
				<h2 className="m-0 font-serif text-2xl">Videos are unavailable</h2>
				<p className="mt-2 mb-0 font-sans text-sm">
					Please try again or open the playlist on YouTube.
				</p>
			</div>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button type="button" onClick={retry}>
					Retry
				</Button>
				<a
					href={getYouTubePlaylistUrl()}
					target="_blank"
					rel="noreferrer"
					className="font-sans text-sm font-semibold underline underline-offset-4"
				>
					Open playlist on YouTube
				</a>
			</div>
		</div>
	</section>
);

const VideoPlaylistLoader = (): JSX.Element => {
	const [attempt, setAttempt] = useState(0);
	const [state, setState] = useState<PlaylistState>({
		status: "loading",
		attempt: 0,
	});

	useEffect(() => {
		const controller = new AbortController();
		const loadPlaylist = async (): Promise<void> => {
			setState({ status: "loading", attempt });
			try {
				const response = await fetch("/api/youtube-playlist", {
					headers: { Accept: "application/json" },
					signal: controller.signal,
				});
				if (!response.ok) throw new Error("Playlist request failed");
				const body: unknown = await response.json();
				const playlist = decodeYouTubePlaylist(body);
				if (playlist.id !== youtubePlaylistId) {
					throw new Error("Unexpected playlist response");
				}
				setState({ status: "success", playlist });
			} catch {
				if (!controller.signal.aborted) setState({ status: "error" });
			}
		};
		void loadPlaylist();
		return () => controller.abort();
	}, [attempt]);

	if (state.status === "loading") return <PlaylistLoading />;
	if (state.status === "error") {
		return <PlaylistError retry={() => setAttempt((value) => value + 1)} />;
	}
	return (
		<VideoPlaylist
			playlistId={state.playlist.id}
			title={state.playlist.title}
			unavailableCount={state.playlist.unavailableCount}
			videos={state.playlist.videos}
		/>
	);
};

export default VideoPlaylistLoader;
