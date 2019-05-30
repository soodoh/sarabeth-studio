import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Img from 'gatsby-image';
import { uid } from 'react-uid';
import Masonry from 'react-masonry-component';
import Lightbox from './Lightbox';

const GalleryCore = (props) => {
  const { classes, photos, ...other } = props;
  const [photoOpen, setOpen] = useState(false);
  const [currentPhoto, setPhoto] = useState(0);

  return (
    <Masonry {...other}>
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

      {Array.isArray(photos) && photos.map((photo, index) => {
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
            onKeyPress={(event) => {
              if (event.charCode === 13) {
                onClick();
              }
            }}
          >
            <Img
              fluid={photo.thumbnail}
              alt={`${photo.title} #${index} Thumbnail`}
              className={classes.photo}
            />
          </div>
        );
      })}
    </Masonry>
  );
};

GalleryCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      fullSize: PropTypes.object.isRequired,
      thumbnail: PropTypes.object.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
};

const styles = theme => ({
  photo: {
    margin: theme.spacing.unit * 2,
    cursor: 'pointer',
  },
  photoContainer: {
    height: 'auto',
    padding: 0,
    margin: 0,
  },
  // Breakpoints
  [theme.breakpoints.up('xs')]: {
    photoContainer: {
      width: '50%',
    },
  },
  [theme.breakpoints.up('md')]: {
    photoContainer: {
      width: '33.33%',
    },
  },
  [theme.breakpoints.up('lg')]: {
    photoContainer: {
      width: '25%',
    },
  },
});

export default withStyles(styles)(GalleryCore);
