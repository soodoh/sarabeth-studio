import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Background from '../Layout/Background';
// import LessonButtons from './LessonButtons';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    minHeight: '50vh',
    padding: theme.spacing(6, 2),

    [theme.breakpoints.up('md')]: {
      padding: `${theme.spacing(6)}px 10vw`,
    },
  },
  background: {
    filter: 'brightness(20%)',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 2),

    '& p': {
      ...theme.typography.body1,
      margin: 0,
    },
    '& h1': {
      ...theme.typography.h2,
      margin: 0,
    },
  },
}));

const About = (props) => {
  const {
    aboutPhoto, aboutDescription,
    // reviewLink,
  } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <Background sizes={aboutPhoto.fluid} className={classes.background} />

      <div
        className={classes.content}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: aboutDescription }}
      />

      {
      // <div className={classes.buttonGroup}>
      //   <LessonButtons reviewLink={reviewLink} />
      // </div>
      }
    </div>
  );
};

About.propTypes = {
  // reviewLink: PropTypes.string,
  aboutPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    fluid: PropTypes.object.isRequired,
  }).isRequired,
  aboutDescription: PropTypes.string.isRequired,
};
About.defaultProps = {
  // reviewLink: null,
};

export default About;
