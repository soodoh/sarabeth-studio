import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import AudioPlayer from './AudioPlayer';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  metadata: {
    display: 'flex',
  },
  title: {
    color: theme.palette.secondary.main,
  },
  subtitle: {
    color: theme.palette.primary.contrastText,
    marginLeft: theme.spacing(2),
  },
}));

const SongEntry = (props) => {
  const {
    title, subtitle, url,
  } = props;
  const classes = useStyles(props);

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

SongEntry.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};
SongEntry.defaultProps = {
  subtitle: '',
};

export default SongEntry;
