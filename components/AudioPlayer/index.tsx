"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import React, { useRef, useState } from "react";

type Props = {
  source: string;
};

const EMPTY_CAPTIONS = "data:text/vtt,WEBVTT";

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioPlayer = ({ source }: Props): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      const duration = audioRef.current.duration || 0;
      const currentProgress =
        duration > 0 ? (audioRef.current.currentTime / duration) * 100 : 0;
      setProgress(currentProgress);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressBarClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    if (audioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const newTime = (clickPosition / rect.width) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="flex items-center gap-[30px] bg-background-light p-[15px]">
      <audio ref={audioRef} src={source} onTimeUpdate={handleTimeUpdate}>
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
      >
        {isPlaying ? <Pause className="size-6" /> : <Play className="size-6" />}
      </Button>

      <div>
        <span>{formatTime(currentTime)}</span>
      </div>

      <button
        type="button"
        className="h-[10px] grow cursor-pointer bg-background"
        ref={progressBarRef}
        onClick={handleProgressBarClick}
        aria-label="Seek audio"
      >
        <div
          className="h-full bg-accent transition-[width] duration-100 linear"
          style={{ width: `${progress}%` }}
        />
      </button>
    </div>
  );
};

export default AudioPlayer;
