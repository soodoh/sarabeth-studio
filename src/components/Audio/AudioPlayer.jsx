import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Play from 'mdi-material-ui/Play';
import Pause from 'mdi-material-ui/Pause';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    background: 'none',
    border: 'none',
    color: theme.palette.secondary.contrastText,
  },
  timecode: {
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(0, 2),
  },
  progress: {
    flex: 1,
    height: theme.spacing(1),
    cursor: 'pointer',
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.secondary.contrastText,
  },
  progressBar: {
    backgroundColor: theme.palette.primary.contrastText,
  },
}));

const formatTimecode = time => {
  const minutes = (Math.floor(time / 60) || 0).toString().padStart(2, '0');
  const seconds = (Math.floor(time % 60) || 0).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
};

const AudioPlayer = props => {
  const { url, title } = props;
  const classes = useStyles(props);
  const playerRef = useRef();
  const [currentTime, setTime] = useState(0);
  const [isPlaying, setPlayback] = useState(false);
  const duration = playerRef.current ? playerRef.current.duration : 1;

  const seekTime = event => {
    // Page X calculations
    const mouseX = event.pageX;
    const parentX = event.currentTarget.offsetLeft;
    const parentWidth = event.currentTarget.offsetWidth;
    // Useful values
    const percentage = (mouseX - parentX) / parentWidth;
    const currentDuration = playerRef.current.duration || 0;
    const newTime = currentDuration * percentage;

    // setTime(newTime);
    playerRef.current.currentTime = newTime;
  };

  return (
    <div className={classes.container}>
      <div>
        <audio ref={playerRef} onTimeUpdate={() => setTime(playerRef.current.currentTime)}>
          <source src={url} type="audio/mp3" />
          <track kind="captions" label={title} />
        </audio>
      </div>

      <button
        type="button"
        className={classes.button}
        onClick={() => {
          if (isPlaying) {
            playerRef.current.pause();
          } else {
            playerRef.current.play();
          }
          setPlayback(!isPlaying);
        }}
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>

      <Typography variant="body1" color="inherit" className={classes.timecode}>
        {formatTimecode(currentTime)}
      </Typography>

      <LinearProgress
        classes={{ root: classes.progress, bar1Determinate: classes.progressBar }}
        onClick={seekTime}
        variant="determinate"
        color="primary"
        value={(currentTime / duration) * 100}
      />
    </div>
  );
};

AudioPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default AudioPlayer;
