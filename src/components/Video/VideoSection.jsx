import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { StaticQuery, graphql } from 'gatsby';
import Filters from '../common/Filters';
import Title from '../common/Title';
import VideoList from './VideoList';

const VideoSectionCore = (props) => {
  const { classes, videoGroups } = props;
  const [currentVideoGroup, setGroup] = useState('All');

  const getVideoGroups = () => {
    const newVideoGroups = videoGroups
      .map(group => group.label);

    newVideoGroups.unshift('All');
    return newVideoGroups;
  };

  const getVideos = () => {
    const videos = currentVideoGroup === 'All'
      ? videoGroups.reduce((acc, group) => (
        [...acc, ...group.videos]
      ), [])
      : videoGroups.find(videoGroup => videoGroup.label === currentVideoGroup)
        .videos;

    return videos.map(video => ({
      url: video.link,
      title: video.label,
    }));
  };

  return (
    <div className={classes.container}>
      <Title>Video</Title>

      {videoGroups.length > 1
        && (
        <Filters
          list={getVideoGroups()}
          activeItem={currentVideoGroup}
          onClick={videoGroup => setGroup(videoGroup)}
        />
        )
      }

      <VideoList videos={getVideos()} />
    </div>
  );
};

VideoSectionCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  videoGroups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      videos: PropTypes.arrayOf(
        PropTypes.object,
      ).isRequired,
    }),
  ).isRequired,
};

const styles = theme => ({
  container: {
    paddingBottom: theme.spacing.unit * 8,
  },
});

const VideoSection = withStyles(styles)(VideoSectionCore);

export default () => (
  <StaticQuery
    query={graphql`
      query VideoQuery {
        allContentfulVideoGroups(sort: {fields: [label], order: ASC}) {
          edges{
            node{
              label,
              videos{
                label,
                link
              }
            }
          }
        }
      }
    `}
    render={data => (
      <VideoSection
        videoGroups={data.allContentfulVideoGroups.edges.map(item => (
          item.node
        ))}
      />
    )}
  />
);
