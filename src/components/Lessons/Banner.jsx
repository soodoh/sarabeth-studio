import React from 'react';
import PropTypes from 'prop-types';
import ReactSvg from 'react-svg';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Background from '../Layout/Background';
import Title from '../common/Title';

const Banner = (props) => {
  const {
    classes, mainPhoto, voiceLessonsSvg, voiceLessons,
    pianoLessonsSvg, pianoLessons,
  } = props;

  return (
    <>
      <div className={classes.banner}>
        <Background sizes={mainPhoto.fluid} className={classes.bannerPhoto} />
        <Title>
          {'Sarabeth\'s Studio'}
        </Title>
      </div>

      <Grid container>
        <Grid item xs={12} className={classes.buttonGroup}>
          <Button
            variant="outlined"
            className={classes.bannerButton}
            onClick={() => {}}
          >
            Book a Lesson
          </Button>
          <Button
            variant="outlined"
            className={classes.bannerButton}
            onClick={() => {}}
          >
            Teaching Philosophy
          </Button>
          <Button
            variant="outlined"
            className={classes.bannerButton}
            onClick={() => {}}
          >
            View Rates
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.blurb}>
          <ReactSvg
            src={voiceLessonsSvg}
            svgClassName={classes.svgImage}
          />

          <div
            className={classes.blurbContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: voiceLessons }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.blurb}>
          <ReactSvg
            src={pianoLessonsSvg}
            svgClassName={classes.svgImage}
          />

          <div
            className={classes.blurbContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: pianoLessons }}
          />
        </Grid>
      </Grid>
    </>
  );
};

Banner.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  mainPhoto: PropTypes.shape({
    fluid: PropTypes.object.isRequired,
  }).isRequired,
  voiceLessonsSvg: PropTypes.string.isRequired,
  voiceLessons: PropTypes.string.isRequired,
  pianoLessonsSvg: PropTypes.string.isRequired,
  pianoLessons: PropTypes.string.isRequired,
};

const styles = theme => ({
  banner: {
    height: '50vh',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerPhoto: {
    filter: 'brightness(80%)',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    margin: `${theme.spacing.unit * 2}px 0`,
  },
  bannerButton: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.light,
    border: 'none',
    margin: theme.spacing.unit * 2,
  },
  blurb: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  blurbContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `0 ${theme.spacing.unit * 2}px`,

    '& p': {
      ...theme.typography.body1,
      color: theme.palette.secondary.main,
      margin: 0,
    },
    '& h1': {
      ...theme.typography.h2,
      fontSize: '1.5rem',
      margin: 0,
    },
  },
  svgImage: {
    '& path': {
      fill: theme.palette.secondary.light,
    },
  },
});

export default withStyles(styles)(Banner);
