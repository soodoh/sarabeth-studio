"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import React, { useRef, useState } from "react";

type Props = {
  source: string;
};

const AudioPlayer = ({ source }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const newTime = (clickPosition / rect.width) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex items-center gap-[30px] bg-background-light p-[15px]">
      <audio ref={audioRef} src={source} onTimeUpdate={handleTimeUpdate} />
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

      <div
        className="h-[10px] grow cursor-pointer bg-background"
        ref={progressBarRef}
        onClick={handleProgressBarClick}
      >
        <div
          className="h-full bg-accent transition-[width] duration-100 linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
