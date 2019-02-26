import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Background from '../Layout/Background';

const About = (props) => {
  const {
    classes, aboutPhoto, aboutDescription,
  } = props;

  return (
    <div className={classes.container}>
      <Background sizes={aboutPhoto.fluid} className={classes.background} />

      <div
        className={classes.content}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: aboutDescription }}
      />
    </div>
  );
};

About.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  aboutPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    fluid: PropTypes.object.isRequired,
  }).isRequired,
  aboutDescription: PropTypes.string.isRequired,
};

const styles = theme => ({
  container: {
    position: 'relative',
    minHeight: '50vh',
    padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px`,
    [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
      padding: `${theme.spacing.unit * 4}px 10vw`,
    },
  },
  background: {
    filter: 'brightness(20%)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `0 ${theme.spacing.unit * 2}px`,

    '& p': {
      ...theme.typography.body1,
      margin: 0,
    },
    '& h1': {
      ...theme.typography.h2,
      margin: 0,
    },
  },
});

export default withStyles(styles)(About);
