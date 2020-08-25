import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import Lightbox from 'react-images';

const ThemedLightbox = props => {
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
  const { images, isOpen, currentImage, onClickPrev, onClickNext, onClose } = props;

  return (
    <Lightbox
      theme={themeProp}
      backdropClosesModal
      images={images}
      isOpen={isOpen}
      currentImage={currentImage}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
      onClose={onClose}
    />
  );
};

ThemedLightbox.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool,
  currentImage: PropTypes.number.isRequired,
  onClickPrev: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
ThemedLightbox.defaultProps = {
  isOpen: false,
};

export default ThemedLightbox;
