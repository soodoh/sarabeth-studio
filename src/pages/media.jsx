import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import VideoSection from '../components/Video/VideoSection';
import AudioSection from '../components/Audio/AudioSection';

const MediaCore = (props) => {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <VideoSection />
      <AudioSection />
    </div>
  );
};
MediaCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 4,
  },
});

export default withStyles(styles)(MediaCore);
