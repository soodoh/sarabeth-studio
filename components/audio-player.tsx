import { Pause, Play } from "lucide-react";
import { type ChangeEvent, type JSX, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
	source: string;
	title: string;
};

const EMPTY_CAPTIONS = "data:text/vtt,WEBVTT";

const formatTime = (time: number): string => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioPlayer = ({ source, title }: Props): JSX.Element => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [playbackError, setPlaybackError] = useState("");

	const handlePlaybackError = (): void => {
		if (audioRef.current && !audioRef.current.paused) {
			audioRef.current.pause();
		}
		setIsPlaying(false);
		setPlaybackError("Audio playback is unavailable.");
	};

	const togglePlayPause = (): void => {
		if (!audioRef.current) return;

		if (audioRef.current.paused) {
			setPlaybackError("");
			void audioRef.current.play().catch(handlePlaybackError);
		} else {
			audioRef.current.pause();
		}
	};

	const synchronizeAudioTime = (): void => {
		if (!audioRef.current) return;
		setDuration(
			Number.isFinite(audioRef.current.duration)
				? audioRef.current.duration
				: 0,
		);
		setCurrentTime(audioRef.current.currentTime);
	};

	const seek = (event: ChangeEvent<HTMLInputElement>): void => {
		if (!audioRef.current) return;
		const newTime = Number(event.target.value);
		audioRef.current.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	return (
		<fieldset
			data-slot="audio-player"
			className="m-0 w-full min-w-0 border-0 p-0"
		>
			<legend className="sr-only">{title} audio player</legend>
			<div className="flex min-w-0 items-center gap-[30px] bg-background-light p-[15px]">
				<audio
					ref={audioRef}
					src={source}
					preload="none"
					onDurationChange={synchronizeAudioTime}
					onEnded={() => setIsPlaying(false)}
					onError={handlePlaybackError}
					onLoadedMetadata={synchronizeAudioTime}
					onPause={() => setIsPlaying(false)}
					onPlay={() => setIsPlaying(true)}
					onTimeUpdate={synchronizeAudioTime}
				>
					<track
						kind="captions"
						src={EMPTY_CAPTIONS}
						srcLang="en"
						label="English"
						default
					/>
				</audio>
				<Button
					variant="unstyled"
					size="unstyled"
					onClick={togglePlayPause}
					className="cursor-pointer border-none bg-transparent p-0 text-accent hover:bg-transparent [&_svg]:fill-accent"
					aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
				>
					{isPlaying ? (
						<Pause className="size-6" />
					) : (
						<Play className="size-6" />
					)}
				</Button>

				<div>
					<span>{formatTime(currentTime)}</span>
				</div>

				<input
					data-slot="audio-seek"
					type="range"
					min={0}
					max={duration}
					step={0.1}
					value={Math.min(currentTime, duration)}
					onChange={seek}
					aria-label={`Seek ${title}`}
					className="h-6 w-0 min-w-0 grow cursor-pointer appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
					style={{
						background: `linear-gradient(to right, var(--color-accent) ${progress}%, var(--color-background) ${progress}%) center / 100% 10px no-repeat`,
					}}
				/>
			</div>
			{playbackError && (
				<p className="mt-2 text-sm text-foreground" role="alert">
					{playbackError}
				</p>
			)}
		</fieldset>
	);
};

export default AudioPlayer;
