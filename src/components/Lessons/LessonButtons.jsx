import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
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
}));

const LessonButtons = (props) => {
  const { reviewLink } = props;
  const classes = useStyles();
  const transitionDelay = 500;

  return (
    <React.Fragment>
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
};
LessonButtons.defaultProps = {
  reviewLink: null,
};

export default LessonButtons;
