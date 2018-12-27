import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PlayIcon from 'mdi-material-ui/Play';

const VideoThumbnailCore = (props) => {
  const {
    classes, title, onClick,
  } = props;

  return (
    <div className={classes.container}>
      <div
        role="button"
        tabIndex={0}
        className={classes.videoContainer}
        onClick={onClick}
        onKeyPress={(event) => {
          if (event.keyCode === 13) {
            onClick();
          }
        }}
      >
        <PlayIcon style={{ fontSize: '2.5rem' }} />
        <Typography
          variant="body2"
          color="inherit"
          className={classes.label}
        >
          {title}
        </Typography>
      </div>
    </div>
  );
};

VideoThumbnailCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const styles = theme => ({
  thumbnail: {
    width: '100%',
    height: 'auto',
    verticalAlign: 'top', // Removes bottom gutter for Masonry
  },
  videoContainer: {
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.primary.contrastText,

    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  label: {
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  // Breakpoints
  [`@media (min-width: ${theme.breakpoints.values.xs}px)`]: {
    container: {
      width: '50%',
    },
    videoContainer: {
      margin: theme.spacing.unit / 2,
      height: '30vw',
    },
  },
  [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
    container: {
      width: '33.33%',
    },
    videoContainer: {
      margin: theme.spacing.unit * 2,
      height: '20vw',
    },
  },
  [`@media (min-width: ${theme.breakpoints.values.lg}px)`]: {
    container: {
      width: '25%',
    },
    videoContainer: {
      height: '15vw',
    },
  },
});

export default withStyles(styles)(VideoThumbnailCore);
