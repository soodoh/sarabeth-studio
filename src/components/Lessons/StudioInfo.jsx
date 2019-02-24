import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby';
import Img from 'gatsby-image';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Lightbox from '../Photos/Lightbox';

class StudioInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photosOpen: false,
      currentPhoto: 0,
    };
  }

  render() {
    const {
      classes, teachingResume, photoGallery,
    } = this.props;
    const { photosOpen, currentPhoto } = this.state;

    return (
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={6} md={8}>
          <Typography variant="h2" align="center">
            Teaching Resume
          </Typography>

          <div
            className={classes.content}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: teachingResume }}
          />
          <div className={classes.centerButton}>
            <Button
              variant="outlined"
              className={classes.button}
              onClick={() => navigate('contact')}
            >
              Book a Lesson
            </Button>
          </div>
        </Grid>

        {photoGallery && photoGallery.length && (
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h2" align="center">
              Photos
            </Typography>

            <Lightbox
              images={photoGallery.map(photo => ({
                src: photo.fullSize.src,
                srcSet: photo.fullSize.srcSet,
                caption: photo.description,
                alt: `${photo.title} (Full Resolution)`,
              }))}
              isOpen={photosOpen}
              currentImage={currentPhoto}
              onClickPrev={() => this.setState({ currentPhoto: currentPhoto - 1 })}
              onClickNext={() => this.setState({ currentPhoto: currentPhoto + 1 })}
              onClose={() => this.setState({ photosOpen: false })}
            />

            <GridListTile
              className={classes.photoGallery}
              onClick={() => this.setState({ photosOpen: true })}
            >
              <Img
                fluid={photoGallery[0].thumbnail}
                alt={photoGallery[0].title}
              />
              <GridListTileBar
                title={(
                  <Typography variant="subtitle1">
                    {"View Sarabeth's Studio"}
                  </Typography>
                )}
              />
            </GridListTile>
          </Grid>
        )}
      </Grid>
    );
  }
}

StudioInfo.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  teachingResume: PropTypes.string.isRequired,
  photoGallery: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      fullSize: PropTypes.object.isRequired,
      thumbnail: PropTypes.object.isRequired,
    }),
  ).isRequired,
};

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 4,
  },
  content: {
    ...theme.typography.body1,
    padding: `0 ${theme.spacing.unit * 2}px`,
    margin: 0,
    '& ul': {
      marginLeft: theme.spacing.unit * -4,
      listStyleType: 'none',
    },
    '& ul li:before': {
      content: '"\\2014"',
      paddingRight: theme.spacing.unit,
    },
    '& h1': {
      ...theme.typography.h4,
    },
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
    border: 'none',
    margin: theme.spacing.unit * 2,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  centerButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  photoGallery: {
    cursor: 'pointer',
  },
});

export default withStyles(styles)(StudioInfo);
