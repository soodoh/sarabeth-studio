import React, { ReactElement, useState } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Fade from 'react-reveal/Fade';
import Title from '../common/Title';
import Filters from '../common/Filters';
import Song from './SongEntry';
import { AudioGroup } from '../../types';

interface AudioSectionProps {
  audioGroups: AudioGroup[];
}

const AudioSection = (props: AudioSectionProps): ReactElement => {
  const { audioGroups } = props;
  const [currentGroup, setGroup] = useState('All');
  const transitionDelay = 200;

  const getAudioGroups = () => {
    const groups = audioGroups.map(group => group.label);

    groups.unshift('All');
    return groups;
  };

  const getAudioFiles = () => {
    let files = [];

    if (currentGroup === 'All') {
      audioGroups.forEach(group => {
        files = [...files, ...group.audioFiles];
      });
    } else {
      const audioGroup = audioGroups.find(group => group.label === currentGroup);
      files = audioGroup.audioFiles;
    }

    return files.filter(audioFile => audioFile?.title && audioFile?.audio?.file?.url);
  };

  return (
    <>
      <Fade top opposite>
        <Title>Audio</Title>
      </Fade>

      {audioGroups.length > 1 && <Filters list={getAudioGroups()} activeItem={currentGroup} onClick={item => setGroup(item)} />}

      {getAudioFiles().map((audio, index) => (
        <Fade key={audio.id} opposite delay={transitionDelay * (index + 1)}>
          <Song title={audio.title} subtitle={audio.subtitle} url={audio.audio.file.url} />
        </Fade>
      ))}
    </>
  );
};

const AudioSectionWithData = (): ReactElement => (
  <StaticQuery
    query={graphql`
      query AudioGroupQuery {
        allContentfulAudioGroups(sort: { fields: [label], order: ASC }) {
          edges {
            node {
              id
              label
              audioFiles {
                id
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
    render={data => <AudioSection audioGroups={data.allContentfulAudioGroups.edges.map((item: { node: AudioGroup }) => item.node)} />}
  />
);

export default AudioSectionWithData;
