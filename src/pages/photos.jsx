import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Metadata from '../components/Layout/Metadata';
import Gallery from '../components/Photos/Gallery';
import Title from '../components/common/Title';
import Filters from '../components/common/Filters';

class PhotosCore extends React.Component {
  constructor(props) {
    super(props);

    this.getAlbums = this.getAlbums.bind(this);
    this.getPhotos = this.getPhotos.bind(this);

    this.state = { currentAlbum: 'All' };
  }

  getAlbums() {
    const { albums } = this.props;
    const albumNames = albums.map(group => group.label);

    albumNames.unshift('All');

    return albumNames;
  }

  getPhotos() {
    const { albums } = this.props;
    const { currentAlbum } = this.state;
    let photos = [];

    if (currentAlbum === 'All') {
      albums.forEach((album) => {
        photos = [...photos, ...album.photos];
      });
    } else {
      const albumPhotos = albums.find(album => album.label === currentAlbum);
      ({ photos } = albumPhotos);
    }

    return photos;
  }

  render() {
    const { classes, albums } = this.props;
    const { currentAlbum } = this.state;

    return (
      <React.Fragment>
        <Metadata
          title="Sarabeth Photos"
          description="Sarabeth Belón's photo gallery. View pictures from past performances, professional headshots and more. Photo credits included when viewing higher resolution images."
        />

        <Grid container spacing={8} className={classes.container}>
          <Grid item xs={12}>
            <Title>Photos</Title>
          </Grid>

          {albums.length > 1
          && (
            <Filters
              list={this.getAlbums()}
              activeItem={currentAlbum}
              onClick={album => this.setState({ currentAlbum: album })}
            />
          )
        }

          <Grid item xs={12}>
            <Gallery photos={this.getPhotos()} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

PhotosCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  albums: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

const styles = theme => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit * 4,
  },
});

const Photos = withStyles(styles)(PhotosCore);

export default () => (
  <StaticQuery
    query={graphql`
      query PhotosQuery {
        allContentfulPhotoAlbums(sort: {fields: [label], order: ASC}) {
          edges{
            node{
              label
              photos{
                title
                description
                fullSize: fluid(maxWidth: 1920) {
                  srcWebp
                  srcSetWebp
                }
                thumbnail: fluid(maxWidth: 600) {
                  ...GatsbyContentfulFluid_withWebp
                }
              }
            }
          }
        }
      }
    `}
    render={data => (
      <Photos
        albums={data.allContentfulPhotoAlbums.edges.map(item => (
          item.node
        ))}
      />
    )}
  />
);
