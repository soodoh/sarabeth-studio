import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Grid from '@material-ui/core/Grid';
import Filters from '../common/Filters';
import Title from '../common/Title';
import VideoList from './VideoList';

class VideoSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentVideoGroup: 'All',
    };
    this.getVideoGroups = this.getVideoGroups.bind(this);
    this.getVideos = this.getVideos.bind(this);
  }

  getVideoGroups() {
    const { videoGroups } = this.props;

    const newVideoGroups = videoGroups
      .map(group => group.label);

    newVideoGroups.unshift('All');

    return newVideoGroups;
  }

  getVideos() {
    const { videoGroups } = this.props;
    const { currentVideoGroup } = this.state;

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
  }

  render() {
    const { videoGroups } = this.props;
    const { currentVideoGroup } = this.state;

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Title>Video</Title>
        </Grid>

        {videoGroups.length > 1
          && (
          <Filters
            list={this.getVideoGroups()}
            activeItem={currentVideoGroup}
            onClick={videoGroup => this.setState({ currentVideoGroup: videoGroup })}
          />
          )
        }

        <Grid item xs={12}>
          <VideoList videos={this.getVideos()} />
        </Grid>
      </Grid>
    );
  }
}

VideoSection.propTypes = {
  videoGroups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      videos: PropTypes.arrayOf(
        PropTypes.object,
      ).isRequired,
    }),
  ).isRequired,
};

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
