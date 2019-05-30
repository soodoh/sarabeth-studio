import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PlayIcon from 'mdi-material-ui/Play';
// import Img from 'gatsby-image';
import Background from '../Layout/Background';

const VideoThumbnailCore = (props) => {
  const {
    classes, title, onClick, thumbnail,
  } = props;

  return (
    <div
      className={classes.container}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={(event) => {
        if (event.charCode === 13) {
          onClick();
        }
      }}
    >
      <Background sizes={thumbnail} />

      <div className={classes.title}>
        <PlayIcon style={{ fontSize: '2.5rem' }} />
        <Typography variant="body2" color="inherit" className={classes.label}>
          {title}
        </Typography>
      </div>
    </div>
  );
};

VideoThumbnailCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
};

const styles = theme => ({
  container: {
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.primary.contrastText,

    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
  thumbnail: {
    width: '100%',
    height: 'auto',
  },
  label: {
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  title: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, .6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default withStyles(styles)(VideoThumbnailCore);
