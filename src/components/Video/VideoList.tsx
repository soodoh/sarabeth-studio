import React, { ReactElement, useState } from 'react';
import Player from 'react-player';
import { makeStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import VideoThumbnail from './VideoThumbnail';
import { Video } from '../../types';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  videoList: {
    marginTop: theme.spacing(4),
    display: 'grid',
    width: '100%',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridAutoRows: '15vw',

    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
      gridAutoRows: '20vw',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr 1fr',
      gridGap: theme.spacing(1 / 2),
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
}));

interface VideoProps {
  videos: Video[];
}

const VideoList = (props: VideoProps): ReactElement => {
  const { videos } = props;
  const classes = useStyles(props);
  const [videoOpen, setOpen] = useState(false);
  const [currentVideo, setVideo] = useState(0);

  return (
    <div className={classes.container}>
      <Dialog open={videoOpen} maxWidth="md" fullWidth onClose={() => setOpen(false)} TransitionComponent={Slide}>
        <div className={classes.playerContainer}>
          <Player url={videos[currentVideo].link} controls className={classes.player} width="100%" height="100%" />
        </div>
      </Dialog>

      <div className={classes.videoList}>
        {Array.isArray(videos) &&
          videos.map((video, index) => (
            <VideoThumbnail
              key={video.id}
              index={index}
              title={video.label}
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

export default VideoList;
