import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import ReactSvg from 'react-svg';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Background from '../Layout/Background';
import Title from '../common/Title';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: '50% 50%',

    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '100%',
    },
  },
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
    gridColumn: '1 / 3',
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2, 0),

    [theme.breakpoints.down('xs')]: {
      gridColumn: '1 / 2',
    },
  },
  bannerButton: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.light,
    border: 'none',
    margin: theme.spacing(2),
  },
  blurb: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(7),

    [theme.breakpoints.up('md')]: {
      paddingLeft: '10vw',
      paddingRight: '10vw',
    },
  },
  blurbContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(0, 2),

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
}));

const Banner = (props) => {
  const {
    mainPhoto,
    voiceLessonsSvg,
    voiceLessons,
    pianoLessonsSvg,
    pianoLessons,
    aboutRef,
    infoRef,
  } = props;
  const classes = useStyles(props);

  return (
    <React.Fragment>
      <div className={classes.banner}>
        <Background sizes={mainPhoto.fluid} className={classes.bannerPhoto} />
        <Title>Sarabeth&apos;s Studio</Title>
      </div>

      <div className={classes.container}>
        <div className={classes.buttonGroup}>
          <Button
            variant="outlined"
            className={classes.bannerButton}
            onClick={() => navigate('contact')}
          >
            Book a Lesson
          </Button>
          <Button
            variant="outlined"
            className={classes.bannerButton}
            onClick={() => window.scrollTo(0, aboutRef.current.offsetTop - 100)}
          >
            Teaching Philosophy
          </Button>
          <Button
            variant="outlined"
            className={classes.bannerButton}
            onClick={() => window.scrollTo(0, infoRef.current.offsetTop - 100)}
          >
            View Rates
          </Button>
        </div>

        <div className={classes.blurb}>
          <ReactSvg src={voiceLessonsSvg} className={classes.svgImage} />
          <div
            className={classes.blurbContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: voiceLessons }}
          />
        </div>

        <div className={classes.blurb}>
          <ReactSvg src={pianoLessonsSvg} className={classes.svgImage} />
          <div
            className={classes.blurbContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: pianoLessons }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

Banner.propTypes = {
  mainPhoto: PropTypes.shape({
    fluid: PropTypes.object.isRequired,
  }).isRequired,
  voiceLessonsSvg: PropTypes.string.isRequired,
  voiceLessons: PropTypes.string.isRequired,
  pianoLessonsSvg: PropTypes.string.isRequired,
  pianoLessons: PropTypes.string.isRequired,
  aboutRef: PropTypes.shape({}).isRequired,
  infoRef: PropTypes.shape({}).isRequired,
};

export default Banner;
