import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby';
import Img from 'gatsby-image';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Lightbox from '../Photos/Lightbox';

const StudioInfo = (props) => {
  const { classes, teachingResume, photoGallery } = props;
  const [photosOpen, setOpen] = useState(false);
  const [currentPhoto, setPhoto] = useState(0);

  return (
    <div className={classes.container}>
      <div className={classes.gridItem}>
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
      </div>

      {photoGallery && photoGallery.length && (
        <div className={classes.gridItem}>
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
            onClickPrev={() => setPhoto(currentPhoto - 1)}
            onClickNext={() => setPhoto(currentPhoto + 1)}
            onClose={() => setOpen(false)}
          />

          <GridListTile
            component="div"
            className={classes.photoGallery}
            onClick={() => setOpen(true)}
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
        </div>
      )}
    </div>
  );
};

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
    display: 'grid',
    gridTemplateColumns: '1fr 30%',
    paddingLeft: '10vw',
    paddingRight: '10vw',

    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '50% 50%',
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '100%',
    },
  },
  gridItem: {
    padding: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 4}px`,
  },
  content: {
    ...theme.typography.body1,
    padding: 0,
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
