import React, { ReactElement, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { StaticQuery, graphql } from 'gatsby';
import Fade from 'react-reveal/Fade';
import Filters from '../common/Filters';
import Title from '../common/Title';
import VideoList from './VideoList';
import { VideoGroup } from '../../types';

const useStyles = makeStyles(theme => ({
  container: {
    paddingBottom: theme.spacing(8),
  },
}));

interface VideoSectionProps {
  videoGroups: VideoGroup[];
}

const VideoSection = (props: VideoSectionProps): ReactElement => {
  const { videoGroups } = props;
  const classes = useStyles(props);
  const [currentVideoGroup, setGroup] = useState('All');

  const getVideoGroups = () => {
    const newVideoGroups = videoGroups.map(group => group.label);

    newVideoGroups.unshift('All');
    return newVideoGroups;
  };

  const allVideos =
    currentVideoGroup === 'All'
      ? videoGroups.reduce((acc, group) => [...acc, ...group.videos], [])
      : videoGroups.find(videoGroup => videoGroup.label === currentVideoGroup).videos;

  return (
    <div className={classes.container}>
      <Fade top opposite>
        <Title>Video</Title>
      </Fade>

      {videoGroups.length > 1 && (
        <Filters list={getVideoGroups()} activeItem={currentVideoGroup} onClick={videoGroup => setGroup(videoGroup)} />
      )}

      <VideoList videos={allVideos} />
    </div>
  );
};

const VideoSectionWithData = (): ReactElement => (
  <StaticQuery
    query={graphql`
      query VideoQuery {
        allContentfulVideoGroups(sort: { fields: [label], order: ASC }) {
          edges {
            node {
              id
              label
              videos {
                id
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
    render={data => <VideoSection videoGroups={data.allContentfulVideoGroups.edges.map((item: { node: VideoGroup }) => item.node)} />}
  />
);
export default VideoSectionWithData;
