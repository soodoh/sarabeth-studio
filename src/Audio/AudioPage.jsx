import React from 'react';
import { uid } from 'react-uid';
import Keys from '../keys';
import Loading from '../Loading';
import Title from '../Title';
import Filters from '../Filters';
import Song from './Song';
import Grid from '@material-ui/core/Grid';

export default class Audio extends React.Component {
	constructor(props) {
		super(props);

		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.getAudioGroups = this.getAudioGroups.bind(this);
		this.getAudioFiles = this.getAudioFiles.bind(this);

		this.state = {
			audioGroups: [],
			currentAudioGroup: 'All',
			loading: true,
		};
	}

	componentDidMount() {
		this.client.getEntries({
      content_type: 'audio',
      order: 'fields.label',
    }).then((res) => {
			this.setState({
				audioGroups: res.items,
				loading: false,
			});
		});
	}

	getAudioGroups() {
    const { audioGroups } = this.state;
		const groups = audioGroups
			.map(group => group.fields.label);

		groups.unshift('All');
		return groups;
	}

	getAudioFiles() {
    const { currentAudioGroup, audioGroups } = this.state;
		let files = [];

		if(currentAudioGroup === 'All') {
			audioGroups.forEach((group) => {
				files = [...files, ...group.fields.audioFiles];
			});
		} else {
			const audioGroup = audioGroups.find(group => group.fields.label === currentAudioGroup);
			files = audioGroup.fields.audioFiles;
    }

    return files.filter(audioFile => (
      audioFile.fields
      && audioFile.fields.title
      && audioFile.fields.audio.fields.file.url
    ));
	}

	render() {
    const { loading, audioGroups, currentAudioGroup } = this.state;

		if (loading) {
      return <Loading />;
    }

		return (
			<Grid container spacing={8}>
				<Grid item xs={12}>
					<Title>Audio</Title>
				</Grid>

				{audioGroups.length > 1 &&
          <Filters
            list={this.getAudioGroups()}
            activeItem={currentAudioGroup}
            onClick={(item) => this.setState({currentAudioGroup: item})}
					/>
				}
				<Grid item xs={12}>
					{this.getAudioFiles().map(audio => (
            <Song
              key={uid(audio)}
              title={audio.fields.title}
              subtitle={audio.fields.subtitle}
              url={audio.fields.audio.fields.file.url}
						/>
					))}
				</Grid>
			</Grid>
		);
	}
}
