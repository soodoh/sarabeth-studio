import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { uid } from 'react-uid';
import Grid from '@material-ui/core/Grid';
import Title from '../common/Title';
import Filters from '../common/Filters';
import Song from './SongEntry';

class AudioSection extends React.Component {
  constructor(props) {
    super(props);

    this.getAudioGroups = this.getAudioGroups.bind(this);
    this.getAudioFiles = this.getAudioFiles.bind(this);

    this.state = {
      currentGroup: 'All',
    };
  }

  getAudioGroups() {
    const { audioGroups } = this.props;
    const groups = audioGroups
      .map(group => group.label);

    groups.unshift('All');
    return groups;
  }

  getAudioFiles() {
    const { audioGroups } = this.props;
    const { currentGroup } = this.state;
    let files = [];

    if (currentGroup === 'All') {
      audioGroups.forEach((group) => {
        files = [...files, ...group.audioFiles];
      });
    } else {
      const audioGroup = audioGroups.find(group => group.label === currentGroup);
      files = audioGroup.audioFiles;
    }

    return files.filter(audioFile => (
      audioFile
      && audioFile.title
      && audioFile.audio.file.url
    ));
  }

  render() {
    const { audioGroups } = this.props;
    const { currentGroup } = this.state;

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Title>Audio</Title>
        </Grid>

        {audioGroups.length > 1
          && (
          <Filters
            list={this.getAudioGroups()}
            activeItem={currentGroup}
            onClick={item => this.setState({ currentGroup: item })}
          />
          )
        }
        <Grid item xs={12}>
          {this.getAudioFiles().map(audio => (
            <Song
              key={uid(audio)}
              title={audio.title}
              subtitle={audio.subtitle}
              url={audio.audio.file.url}
            />
          ))}
        </Grid>
      </Grid>
    );
  }
}

AudioSection.propTypes = {
  audioGroups: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

export default () => (
  <StaticQuery
    query={graphql`
      query AudioGroupQuery {
        allContentfulAudioGroups(sort: {fields: [label], order: ASC}) {
          edges{
            node{
              label
              audioFiles{
                title
                subtitle
                audio {
                  file {
                    url
                    fileName
                    contentType
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => (
      <AudioSection
        audioGroups={data.allContentfulAudioGroups.edges.map(item => (
          item.node
        ))}
      />
    )}
  />
);
