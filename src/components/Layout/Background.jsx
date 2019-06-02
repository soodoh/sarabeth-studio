import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
  },
  background: {
    width: '100%',
    height: '100%',
  },
});

const Background = (props) => {
  const {
    sizes, className, ...others
  } = props;
  const classes = useStyles(props);

  return (
    <div
      className={classNames(classes.container, className)}
      {...others}
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
};
Background.defaultProps = {
  className: null,
};

export default Background;
