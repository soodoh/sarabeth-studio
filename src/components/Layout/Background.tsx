import React, { ReactElement } from 'react';
import Img, { FluidObject } from 'gatsby-image';
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

interface BackgroundProps {
  sizes: FluidObject;
  fullscreen?: boolean;
  className?: string;
}

const Background = (props: BackgroundProps): ReactElement => {
  const { sizes, fullscreen, className } = props;
  const classes = useStyles({ fullscreen });

  return (
    <div className={`${classes.container} ${className || ''}`}>
      <Img fluid={sizes} className={classes.background} alt="Background Image" />
    </div>
  );
};

export default Background;
