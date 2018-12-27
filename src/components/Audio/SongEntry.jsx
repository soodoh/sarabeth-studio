import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AudioPlayer from './AudioPlayer';

const SongEntryCore = (props) => {
  const {
    classes, title, subtitle, url,
  } = props;

  return (
    <div className={classes.container}>
      <div className={classes.metadata}>
        <Typography variant="body2" className={classes.title}>
          {title}
        </Typography>

        <Typography variant="body2" className={classes.subtitle}>
          {subtitle}
        </Typography>
      </div>

      <AudioPlayer
        title={title}
        url={url}
      />
    </div>
  );
};

SongEntryCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};
SongEntryCore.defaultProps = {
  subtitle: '',
};

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2,
  },
  metadata: {
    display: 'flex',
  },
  title: {
    color: theme.palette.secondary.main,
  },
  subtitle: {
    color: theme.palette.primary.contrastText,
    marginLeft: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(SongEntryCore);
