import React, { ReactElement, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import Img from 'gatsby-image';
import Masonry from 'react-masonry-css';
import Lightbox from './Lightbox';
import { Photo } from '../../types';

const useStyles = makeStyles(theme => ({
  masonryContainer: {
    display: 'flex',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(-3),
    width: 'auto',
  },
  column: {
    paddingLeft: theme.spacing(3),
    backgroundClip: 'padding-box',
  },
  photoContainer: {
    marginBottom: theme.spacing(3),
  },
  photo: {
    cursor: 'pointer',
  },
}));

interface GalleryProps {
  photos: Photo[];
}

const Gallery = (props: GalleryProps): ReactElement => {
  const { photos } = props;
  const classes = useStyles(props);
  const [photoOpen, setOpen] = useState(false);
  const [currentPhoto, setPhoto] = useState(0);
  const theme = useTheme();
  const breakpointColumns = {
    default: 4,
    [theme.breakpoints.values.lg]: 3,
    [theme.breakpoints.values.md]: 2,
    [theme.breakpoints.values.sm]: 1,
  };

  return (
    <>
      <Lightbox
        images={photos.map(photo => ({
          src: photo.fullSize.src,
          srcSet: photo.fullSize.srcSet,
          caption: photo.description,
          alt: `${photo.title} (Full Resolution)`,
        }))}
        isOpen={photoOpen}
        currentImage={currentPhoto}
        onClickPrev={() => setPhoto(currentPhoto - 1)}
        onClickNext={() => setPhoto(currentPhoto + 1)}
        onClose={() => setOpen(false)}
      />
      <Masonry breakpointCols={breakpointColumns} className={classes.masonryContainer} columnClassName={classes.column}>
        {Array.isArray(photos) &&
          photos.map((photo, index) => {
            const onClick = () => {
              setOpen(true);
              setPhoto(index);
            };
            return (
              <div
                key={photo.id}
                role="button"
                aria-label={`Open Photo #${index} "${photo.title}"`}
                tabIndex={0}
                className={classes.photoContainer}
                onClick={onClick}
                onKeyPress={event => {
                  if (event.charCode === 13) {
                    onClick();
                  }
                }}
              >
                <Img fluid={photo.thumbnail} alt={`${photo.title} #${index} Thumbnail`} className={classes.photo} />
              </div>
            );
          })}
      </Masonry>
    </>
  );
};

export default Gallery;
