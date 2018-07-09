import React from 'react';
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
			loading: true
		};
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'audio', order: 'fields.label' }).then(res => {
			this.setState({
				audioGroups: res.items,
				loading: false
			});
		});
	}
	
	getAudioGroups() {
		const groups = this.state.audioGroups
			.map(group => group.fields.label);
		
		groups.unshift('All');
		return groups;
	}
	
	getAudioFiles() {
		let files = [];
		
		if(this.state.currentAudioGroup === 'All') {
			this.state.audioGroups.forEach(group => {
				files = [...files, ...group.fields.audioFiles]
			});
		} else {
			const audioGroup = this.state.audioGroups.find(group => group.fields.label === this.state.currentAudioGroup);
			files = audioGroup.fields.audioFiles;
		}
		
		return files;
	}
	
	render() {
		if(this.state.loading)
			return <Loading />;
			
		return (
			<Grid container spacing={8}>
				<Grid item xs={12}>
					<Title>Audio</Title>
				</Grid>
				
				{this.state.audioGroups.length > 1 &&
					<Filters list={this.getAudioGroups()}
					         activeItem={this.state.currentAudioGroup}
					         onClick={(item) => this.setState({currentAudioGroup: item})}
					/>
				}
				<Grid item xs={12}>
					{this.getAudioFiles().map((audio, index) => (
						<Song key={`${audio.fields.title}-${index}`}
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