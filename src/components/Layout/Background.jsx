import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  container: {
    position: ({ fullscreen }) => (fullscreen ? 'fixed' : 'absolute'),
    top: 0,
    right: 0,
    left: 0,
    zIndex: -1,
    height: ({ fullscreen }) => (fullscreen ? '100vh' : '100%'),
  },
  background: {
    width: '100%',
    height: '100%',
  },
});

const Background = (props) => {
  const {
    sizes, fullscreen, className,
  } = props;
  const classes = useStyles({ fullscreen });

  return (
    <div
      className={classNames(classes.container, className)}
    >
      <Img
        fluid={sizes}
        className={classes.background}
        alt="Background Image"
      />
    </div>
  );
};
Background.propTypes = {
  sizes: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  fullscreen: PropTypes.bool,
};
Background.defaultProps = {
  className: null,
  fullscreen: false,
};

export default Background;
