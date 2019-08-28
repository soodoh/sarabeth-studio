import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Metadata from '../components/Layout/Metadata';
import Gallery from '../components/Photos/Gallery';
import Title from '../components/common/Title';
import Filters from '../components/common/Filters';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(4),
  },
}));

const Photos = (props) => {
  const { albums } = props;
  const classes = useStyles(props);
  const [currentAlbum, setAlbum] = useState('All');

  const getAlbums = () => {
    const albumNames = albums.map((group) => group.label);
    albumNames.unshift('All');

    return albumNames;
  };

  const getPhotos = () => {
    let photos = [];

    if (currentAlbum === 'All') {
      albums.forEach((album) => {
        photos = [...photos, ...album.photos];
      });
    } else {
      const albumPhotos = albums.find((album) => album.label === currentAlbum);
      ({ photos } = albumPhotos);
    }

    return photos;
  };

  return (
    <>
      <Metadata
        title="Sarabeth Photos"
        description="Sarabeth Belón's photo gallery. View pictures from past performances, professional headshots and more. Photo credits included when viewing higher resolution images."
        keywords={['sarabeth belon media', 'sarabeth belon photos']}
      />

      <div className={classes.container}>
        <Title>Photos</Title>

        {albums.length > 1 && (
          <Filters
            list={getAlbums()}
            activeItem={currentAlbum}
            onClick={(album) => setAlbum(album)}
          />
        )}

        <Gallery photos={getPhotos()} />
      </div>
    </>
  );
};

Photos.propTypes = {
  albums: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default () => (
  <StaticQuery
    query={graphql`
      query PhotosQuery {
        allContentfulPhotoAlbums(sort: { fields: [label], order: ASC }) {
          edges {
            node {
              label
              photos {
                title
                description
                fullSize: fluid(maxWidth: 1920) {
                  ...GatsbyContentfulFluid_withWebp
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
    render={(data) => (
      <Photos
        albums={data.allContentfulPhotoAlbums.edges.map((item) => item.node)}
      />
    )}
  />
);
