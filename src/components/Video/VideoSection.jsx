import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { StaticQuery, graphql } from 'gatsby';
import Fade from 'react-reveal/Fade';
import Filters from '../common/Filters';
import Title from '../common/Title';
import VideoList from './VideoList';

const useStyles = makeStyles(theme => ({
  container: {
    paddingBottom: theme.spacing(8),
  },
}));

const VideoSection = (props) => {
  const { videoGroups } = props;
  const classes = useStyles(props);
  const [currentVideoGroup, setGroup] = useState('All');

  const getVideoGroups = () => {
    const newVideoGroups = videoGroups.map(group => group.label);

    newVideoGroups.unshift('All');
    return newVideoGroups;
  };

  const getVideos = () => {
    const videos = currentVideoGroup === 'All'
      ? videoGroups.reduce((acc, group) => [...acc, ...group.videos], [])
      : videoGroups.find(videoGroup => videoGroup.label === currentVideoGroup)
        .videos;

    return videos.map(video => ({
      url: video.link,
      title: video.label,
      thumbnail: video.thumbnail && video.thumbnail.fluid,
    }));
  };

  return (
    <div className={classes.container}>
      <Fade top opposite>
        <Title>Video</Title>
      </Fade>

      {videoGroups.length > 1 && (
        <Filters
          list={getVideoGroups()}
          activeItem={currentVideoGroup}
          onClick={videoGroup => setGroup(videoGroup)}
        />
      )}

      <VideoList videos={getVideos()} />
    </div>
  );
};

VideoSection.propTypes = {
  videoGroups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      videos: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
  ).isRequired,
};

export default () => (
  <StaticQuery
    query={graphql`
      query VideoQuery {
        allContentfulVideoGroups(sort: { fields: [label], order: ASC }) {
          edges {
            node {
              label
              videos {
                label
                link
                thumbnail {
                  fluid(maxWidth: 800) {
                    ...GatsbyContentfulFluid_withWebp
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => (
      <VideoSection
        videoGroups={data.allContentfulVideoGroups.edges.map(item => item.node)}
      />
    )}
  />
);
