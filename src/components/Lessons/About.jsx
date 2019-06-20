import React from 'react';
import PropTypes from 'prop-types';
import ReactSvg from 'react-svg';
import { makeStyles } from '@material-ui/styles';
import Fade from 'react-reveal/Fade';
import LessonButtons from './LessonButtons';


const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    padding: theme.spacing(0, 0, 7, 0),

    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '100%',
    },
  },
  blurb: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(0, 2),

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
  svgContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pianoSvgContainer: {
    gridRow: '1 / 2',
    [theme.breakpoints.down('xs')]: {
      gridRow: '3 / 4',
    },
  },
  svgImage: {
    '& path': {
      fill: theme.palette.secondary.light,
    },
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gridColumn: '1 / 3',

    [theme.breakpoints.down('xs')]: {
      gridColumn: '1 / 2',
    },
  },
}));

const About = (props) => {
  const {
    reviewLink, voiceLessonsSvg, pianoLessonsSvg, voiceLessons, pianoLessons,
  } = props;
  const classes = useStyles();
  const transitionDelay = 500;

  return (
    <div className={classes.container}>
      <div className={classes.svgContainer}>
        <Fade left opposite delay={transitionDelay}>
          <ReactSvg src={voiceLessonsSvg} className={classes.svgImage} />
        </Fade>
      </div>

      <div className={classes.blurb}>
        <Fade left opposite delay={transitionDelay * 2}>
          <div
            className={classes.blurbContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: voiceLessons }}
          />
        </Fade>
      </div>

      <div className={`${classes.svgContainer} ${classes.pianoSvgContainer}`}>
        <Fade right opposite delay={transitionDelay}>
          <ReactSvg src={pianoLessonsSvg} className={classes.svgImage} />
        </Fade>
      </div>

      <div className={classes.blurb}>
        <Fade right opposite delay={transitionDelay * 2}>
          <div
            className={classes.blurbContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: pianoLessons }}
          />
        </Fade>
      </div>

      <div className={classes.buttonGroup}>
        <LessonButtons reviewLink={reviewLink} />
      </div>
    </div>
  );
};

About.propTypes = {
  reviewLink: PropTypes.string,
  voiceLessonsSvg: PropTypes.string.isRequired,
  voiceLessons: PropTypes.string.isRequired,
  pianoLessonsSvg: PropTypes.string.isRequired,
  pianoLessons: PropTypes.string.isRequired,
};
About.defaultProps = {
  reviewLink: null,
};

export default About;
