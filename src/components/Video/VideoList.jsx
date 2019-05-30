import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';
import Player from 'react-player';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import VideoThumbnail from './VideoThumbnail';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const VideoListCore = (props) => {
  const { classes, videos } = props;
  const [videoOpen, setOpen] = useState(false);
  const [currentVideo, setVideo] = useState(0);

  return (
    <div className={classes.container}>
      <Dialog
        open={videoOpen}
        maxWidth="md"
        fullWidth
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
      >
        <div className={classes.playerContainer}>
          <Player
            url={videos[currentVideo].url}
            controls
            className={classes.player}
            width="100%"
            height="100%"
          />
        </div>
      </Dialog>

      <div className={classes.videoList}>
        {Array.isArray(videos)
          && videos.map((video, index) => (
            <VideoThumbnail
              key={uid(video)}
              index={index}
              title={video.title}
              thumbnail={video.thumbnail}
              onClick={() => {
                setOpen(true);
                setVideo(index);
              }}
            />
          ))}
      </div>
    </div>
  );
};

VideoListCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  videos: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const styles = theme => ({
  container: {
    paddingTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  videoList: {
    marginTop: theme.spacing.unit * 4,
    display: 'grid',
    width: '100%',
    gridGap: `${theme.spacing.unit * 2}px`,
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridAutoRows: '15vw',

    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
      gridAutoRows: '20vw',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr 1fr',
      gridGap: theme.spacing.unit / 2,
      gridAutoRows: '25vw',
    },
  },
  playerContainer: {
    position: 'relative',
    paddingTop: '56.25%',
    overflow: 'hidden',
    backgroundColor: 'transparent!important',
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default withStyles(styles)(VideoListCore);
