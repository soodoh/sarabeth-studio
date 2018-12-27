import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import Lightbox from 'react-images';

const LightboxCore = (props) => {
  const { theme, ...others } = props;
  const themeProp = {
    container: {
      fontFamily: theme.typography.fontFamily,
    },
    footer: {
      color: theme.palette.primary.light,
    },
    footerCount: {
      color: theme.palette.primary.light,
    },
    arrow: {
      fill: theme.palette.primary.light,
    },
    close: {
      fill: theme.palette.primary.light,
    },
  };

  return (
    <Lightbox
      theme={themeProp}
      backdropClosesModal
      {...others}
    />
  );
};

LightboxCore.propTypes = {
  theme: PropTypes.shape({
    typography: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired,
  }).isRequired,
};

export default withTheme()(LightboxCore);
