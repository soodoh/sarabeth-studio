import React, { useRef, useState } from "react";
import styles from "./AudioPlayer.module.css";
import Play from "../../public/play.svg";
import Pause from "../../public/pause.svg";

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
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
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
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.audioPlayer}>
      <audio
        ref={audioRef}
        src={source}
        onTimeUpdate={handleTimeUpdate}
      />
      <button onClick={togglePlayPause} className={styles.playPauseButton}>
        {isPlaying ? <Pause /> : <Play />}
      </button>

      <div className={styles.timeStamps}>
        <span>{formatTime(currentTime)}</span>
      </div>

      <div className={styles.progressBar}
        ref={progressBarRef}
        onClick={handleProgressBarClick}
      >
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default AudioPlayer;
