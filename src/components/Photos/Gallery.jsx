import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import Img from 'gatsby-image';
import { uid } from 'react-uid';
import Masonry from 'react-masonry-css';
import Lightbox from './Lightbox';

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

const Gallery = props => {
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
                key={uid(photo)}
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

Gallery.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      fullSize: PropTypes.object.isRequired,
      thumbnail: PropTypes.object.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
};

export default Gallery;
