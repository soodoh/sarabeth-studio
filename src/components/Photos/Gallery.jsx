import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Img from 'gatsby-image';
import { uid } from 'react-uid';
import Masonry from 'react-masonry-component';
import Lightbox from './Lightbox';

class GalleryCore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photoActive: false,
      currentPhoto: 0,
    };
  }

  render() {
    const { classes, photos, ...other } = this.props;
    const { photoActive, currentPhoto } = this.state;

    return (
      <Masonry {...other}>
        <Lightbox
          images={photos.map(photo => ({
            src: photo.fullSize.src,
            srcSet: photo.fullSize.srcSetWebp,
            caption: photo.description,
          }))}
          isOpen={photoActive}
          currentImage={currentPhoto}
          onClickPrev={() => this.setState({ currentPhoto: currentPhoto - 1 })}
          onClickNext={() => this.setState({ currentPhoto: currentPhoto + 1 })}
          onClose={() => this.setState({ photoActive: false })}
        />

        {Array.isArray(photos) && photos.map((photo, index) => {
          const onClick = () => this.setState({ photoActive: true, currentPhoto: index });
          return (
            <div
              key={uid(photo)}
              role="button"
              tabIndex={0}
              className={classes.photoContainer}
              onClick={onClick}
              onKeyPress={(event) => {
                if (event.keyCode === 13) {
                  onClick();
                }
              }}
            >
              <Img
                sizes={photo.thumbnail}
                alt={photo.title}
                className={classes.photo}
              />
            </div>
          );
        })}
      </Masonry>
    );
  }
}

GalleryCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      fullSize: PropTypes.shape({
        src: PropTypes.string.isRequired,
      }).isRequired,
      thumbnail: PropTypes.object.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
};

const styles = theme => ({
  photo: {
    margin: theme.spacing.unit * 2,
  },
  photoContainer: {
    height: 'auto',
    padding: 0,
    margin: 0,
  },
  // Breakpoints
  [`@media (min-width: ${theme.breakpoints.values.xs}px)`]: {
    photoContainer: {
      width: '50%',
    },
  },
  [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
    photoContainer: {
      width: '33.33%',
    },
  },
  [`@media (min-width: ${theme.breakpoints.values.lg}px)`]: {
    photoContainer: {
      width: '25%',
    },
  },
});

export default withStyles(styles)(GalleryCore);
