import React from 'react';
import { useTheme } from '@material-ui/styles';
import Lightbox from 'react-images';

const ThemedLightbox = (props) => {
  const theme = useTheme();
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
      {...props}
    />
  );
};

export default ThemedLightbox;
