import React, { ReactElement } from 'react';
import { useTheme } from '@material-ui/styles';
import Lightbox from 'react-images';
import { Photo } from '../../types';

interface LightboxProps {
  images: Photo[];
  isOpen: boolean;
  currentImage: number;
  onClickPrev: () => void;
  onClickNext: () => void;
  onClose: () => void;
}

const ThemedLightbox = (props: LightboxProps): ReactElement => {
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

export default ThemedLightbox;
