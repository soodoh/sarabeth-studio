import React from 'react';
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

class VideoListCore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoActive: false,
      currentVideo: 0,
    };
  }

  render() {
    const { classes, videos } = this.props;
    const { videoActive, currentVideo } = this.state;

    return (
      <div className={classes.container}>
        <Dialog
          open={videoActive}
          maxWidth="md"
          fullWidth
          onClose={() => this.setState({ videoActive: false })}
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

        {Array.isArray(videos) && videos.map((video, index) => (
          <VideoThumbnail
            key={uid(video)}
            index={index}
            title={video.title}
            onClick={() => this.setState({ currentVideo: index, videoActive: true })}
          />
        ))}
      </div>
    );
  }
}

VideoListCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  videos: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
};

export default withStyles(styles)(VideoListCore);
