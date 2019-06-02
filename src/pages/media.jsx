import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Metadata from '../components/Layout/Metadata';
import VideoSection from '../components/Video/VideoSection';
import AudioSection from '../components/Audio/AudioSection';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),

    [theme.breakpoints.up('md')]: {
      padding: `${theme.spacing(4)}px 10vw`,
    },
  },
}));

const Media = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Metadata
        title="Sarabeth's Recordings"
        description="Sarabeth Belón's media page: recordings and videos. Listen to recordings of her opera arias and art songs. Clips of her performances are also available."
        keywords={[
          'sarabeth belon media',
          'sarabeth belon recordings',
        ]}
      />

      <div className={classes.container}>
        <VideoSection />
        <AudioSection />
      </div>
    </React.Fragment>
  );
};

export default Media;
