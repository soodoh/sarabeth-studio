import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const LessonsInfo = (props) => {
  const {
    classes, mainDescription, availability, reviewLink, contact, location, phoneNumber,
  } = props;

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Typography variant="h2" align="center">
          {'Rates & Policies'}
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        md={8}
        className={classes.content}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: mainDescription }}
      />

      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        className={classNames(classes.content, classes.verticalContent)}
      >
        <Typography variant="h4">
          Location
        </Typography>
        <Typography variant="body1">
          {location}
        </Typography>

        <Typography variant="h4">
          Hours
        </Typography>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: availability }}
        />

        <Typography variant="h4">
          Contact
        </Typography>
        <Typography
          variant="body1"
          // component="a"
          // href={`mailto:${contact}`}
        >
          {contact}
        </Typography>
        {phoneNumber && (
          <Typography
            variant="body1"
            component="a"
            href={`tel:${phoneNumber}`}
          >
            {phoneNumber}
          </Typography>
        )}

        {reviewLink && (
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => window.open(reviewLink)}
          >
            View Yelp Reviews
          </Button>
        )}

        <Button
          variant="outlined"
          className={classes.button}
          onClick={() => navigate('contact')}
        >
          Book a Lesson
        </Button>
      </Grid>
    </Grid>
  );
};

LessonsInfo.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  mainDescription: PropTypes.string.isRequired,
  availability: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  reviewLink: PropTypes.string,
  phoneNumber: PropTypes.string,
};
LessonsInfo.defaultProps = {
  reviewLink: null,
  phoneNumber: null,
};

const styles = theme => ({
  container: {
    padding: `${theme.spacing.unit * 6}px 0`,
    [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
      padding: `${theme.spacing.unit * 6}px 10vw`,
    },
  },
  content: {
    ...theme.typography.body1,
    padding: `0 ${theme.spacing.unit * 3}px`,
    margin: 0,
    '& ul': {
      marginLeft: theme.spacing.unit * -4,
      listStyleType: 'none',
    },
    '& ul li:before': {
      content: '"\\2014"',
      paddingRight: theme.spacing.unit,
    },
    '& h1': {
      ...theme.typography.h4,
    },
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
    border: 'none',
    margin: theme.spacing.unit * 2,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  verticalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default withStyles(styles)(LessonsInfo);
