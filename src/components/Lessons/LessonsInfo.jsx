import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const LessonsInfo = (props) => {
  const {
    classes,
    mainDescription,
    availability,
    reviewLink,
    contact,
    location,
    phoneNumber,
  } = props;

  return (
    <div className={classes.container}>
      <Typography variant="h2" align="center" className={classes.title}>
        {'Rates & Policies'}
      </Typography>

      <div
        className={classes.markdown}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: mainDescription }}
      />

      <div className={classNames(classes.markdown, classes.verticalContent)}>
        <Typography variant="h4">Location</Typography>
        <Typography variant="body1">{location}</Typography>

        <Typography variant="h4">Hours</Typography>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: availability }}
        />

        <Typography variant="h4">Contact</Typography>
        <Typography variant="body1" component="a" href={`mailto:${contact}`}>
          {contact}
        </Typography>
        {phoneNumber && (
          <Typography variant="body1" component="a" href={`tel:${phoneNumber}`}>
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
      </div>
    </div>
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
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: '1fr 30%',
    padding: `${theme.spacing.unit * 6}px 10vw`,

    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 50%',
      padding: `${theme.spacing.unit * 6}px 0`,
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '100%',
    },
  },
  title: {
    gridColumn: '1 / 3',
  },
  markdown: {
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
