import React, { ReactElement, useRef, useState } from "react";
import Pause from "../../public/pause.svg";
import Play from "../../public/play.svg";
import styles from "./AudioPlayer.module.scss";

const formatTimecode = (time: number) => {
  const minutes = (Math.floor(time / 60) || 0).toString().padStart(2, "0");
  const seconds = (Math.floor(time % 60) || 0).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};

interface AudioPlayerProps {
  url: string;
  title: string;
}

const AudioPlayer = (props: AudioPlayerProps): ReactElement => {
  const { url, title } = props;
  const playerRef = useRef(null);
  const [currentTime, setTime] = useState(0);
  const [isPlaying, setPlayback] = useState(false);
  const duration = playerRef?.current?.duration || 1;

  const seekTime = (event: any) => {
    // Page X calculations
    const mouseX = event.pageX;
    const parentX = event.currentTarget.offsetLeft;
    const parentWidth = event.currentTarget.offsetWidth;
    // Useful values
    const percentage = (mouseX - parentX) / parentWidth;
    const currentDuration = playerRef?.current?.duration || 0;
    const newTime = currentDuration * percentage;

    // setTime(newTime);
    playerRef.current.currentTime = newTime;
  };

  return (
    <div className={styles.container}>
      <div>
        <audio
          ref={playerRef}
          onTimeUpdate={() => setTime(playerRef.current.currentTime)}
        >
          <source src={url} type="audio/mp3" />
          <track kind="captions" label={title} />
        </audio>
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={() => {
          if (!playerRef) {
            return;
          }
          if (isPlaying) {
            playerRef?.current?.pause();
          } else {
            playerRef?.current?.play();
          }
          setPlayback(!isPlaying);
        }}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>

      <span>{formatTimecode(currentTime)}</span>

      <div className={styles.progressContainer} onClick={seekTime}>
        <div
          className={styles.progress}
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
