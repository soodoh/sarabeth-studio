import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fade from 'react-reveal/Fade';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.secondary.contrastText,
    border: 'none',
    margin: theme.spacing(1, 0),
    width: theme.spacing(20),

    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  contact: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),

    '& a': {
      paddingBottom: theme.spacing(0.5),
    },
  },
}));

const LessonButtons = (props) => {
  const { reviewLink, contact, phoneNumber } = props;
  const classes = useStyles();
  const transitionDelay = 500;

  return (
    <React.Fragment>
      <Fade right opposite delay={transitionDelay}>
        <div className={classes.contact}>
          <Typography variant="h4">Contact</Typography>
          <Typography
            className={classes.email}
            variant="body1"
            component="a"
            href={`mailto:${contact}`}
          >
            {contact}
          </Typography>
          {phoneNumber && (
            <Typography variant="body1" component="a" href={`tel:${phoneNumber}`}>
              {phoneNumber}
            </Typography>
          )}
        </div>
      </Fade>

      {reviewLink && (
        <Fade left opposite delay={transitionDelay}>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={() => window.open(reviewLink)}
          >
            View Yelp Reviews
          </Button>
        </Fade>
      )}

      <Fade right opposite delay={transitionDelay * 2}>
        <Button
          variant="outlined"
          className={classes.button}
          component={Link}
          to="/contact"
        >
          Book a Lesson
        </Button>
      </Fade>
    </React.Fragment>
  );
};

LessonButtons.propTypes = {
  reviewLink: PropTypes.string,
  phoneNumber: PropTypes.string,
  contact: PropTypes.string.isRequired,
};
LessonButtons.defaultProps = {
  reviewLink: null,
  phoneNumber: null,
};

export default LessonButtons;
