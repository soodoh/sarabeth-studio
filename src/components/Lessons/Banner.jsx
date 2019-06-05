import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Background from '../Layout/Background';
import Title from '../common/Title';

const useStyles = makeStyles(theme => ({
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
  bannerButton: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.light,
    border: 'none',
    margin: theme.spacing(2),
  },
  currentRoute: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      color: theme.palette.primary.contrastText,
    },
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}));

const Banner = (props) => {
  const { children, mainPhoto, currentRoute } = props;
  const classes = useStyles(props);
  const routes = [
    { route: '/lessons', label: 'About' },
    { route: '/lessons/philosophy', label: 'Teaching Philosophy' },
    { route: '/lessons/rates', label: 'View Rates' },
    { route: '/lessons/resume', label: 'Teaching Resume' },
  ];

  return (
    <React.Fragment>
      <div className={classes.banner}>
        <Background sizes={mainPhoto.fluid} className={classes.bannerPhoto} />
        <Title>Sarabeth&apos;s Studio</Title>
      </div>

      <div className={classes.container}>
        <div className={classes.buttonGroup}>
          {routes.map(({ route, label }) => (
            <Button
              key={`${route}-${label}`}
              variant="outlined"
              className={classNames({
                [classes.bannerButton]: true,
                [classes.currentRoute]: currentRoute === route,
              })}
              component={Link}
              to={route}
            >
              {label}
            </Button>
          ))}
        </div>

        {children}
      </div>
    </React.Fragment>
  );
};

Banner.propTypes = {
  currentRoute: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
  mainPhoto: PropTypes.shape({
    fluid: PropTypes.object.isRequired,
  }).isRequired,
};

export default Banner;
