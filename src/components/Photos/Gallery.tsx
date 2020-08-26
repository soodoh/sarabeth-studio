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
    width: '100%',
    border: 'none',
    background: 'none',
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
  const [currentPhoto, setPhoto] = useState(null);
  const theme = useTheme();
  const breakpointColumns = {
    default: 4,
    [theme.breakpoints.values.lg]: 3,
    [theme.breakpoints.values.md]: 2,
    [theme.breakpoints.values.sm]: 1,
  };

  return (
    <>
      <Lightbox images={photos} photoIndex={currentPhoto} onChange={setPhoto} onClose={() => setPhoto(null)} />
      <Masonry breakpointCols={breakpointColumns} className={classes.masonryContainer} columnClassName={classes.column}>
        {Array.isArray(photos) &&
          photos.map((photo, index) => {
            return (
              <button key={photo.id} className={classes.photoContainer} onClick={() => setPhoto(index)}>
                <Img fluid={photo.thumbnail} alt={`${photo.title} #${index} Thumbnail`} className={classes.photo} />
              </button>
            );
          })}
      </Masonry>
    </>
  );
};

export default Gallery;
