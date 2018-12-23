import React from 'react';
import Keys from "../keys";
import Loading from '../Loading';
import Filters from '../Filters';
import Title from '../Title';
import VideoList from './VideoList';
import Grid from '@material-ui/core/Grid';

export default class Videos extends React.Component {
	constructor(props) {
		super(props);

		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);

		this.state = {
			loading: true,
			videoGroups: [],
			currentVideoGroup: 'All',
		};
		this.getVideoGroups = this.getVideoGroups.bind(this);
		this.getVideos = this.getVideos.bind(this);
	}

	componentDidMount() {
		this.client.getEntries({ content_type: 'video', order: 'fields.label' }).then(res => {
			this.setState({
				videoGroups: res.items,
				loading: false,
			});
		});
	}

	getVideoGroups() {
    const { videoGroups } = this.state;
		const newVideoGroups = videoGroups
			.map(group => group.fields.label);

		newVideoGroups.unshift('All');

		return newVideoGroups;
	}

	getVideos() {
    const { currentVideoGroup, videoGroups } = this.state;
    const videos = currentVideoGroup === 'All'
      ? videoGroups.reduce((acc, group) => (
        [...acc, ...group.fields.videos]
      ), [])
      : videoGroups.find(videoGroup => videoGroup.fields.label === currentVideoGroup)
        .fields.videos;

		return videos.map(video => ({
			url: video.fields.link,
			title: video.fields.label,
		}));
	}

	render() {
    const { loading, videoGroups, currentVideoGroup } = this.state;

		if(loading)
			return <Loading />;

		return (
			<Grid container spacing={8}>
				<Grid item xs={12}>
					<Title>Video</Title>
				</Grid>

				{videoGroups.length > 1 &&
          <Filters
            list={this.getVideoGroups()}
            activeItem={currentVideoGroup}
            onClick={videoGroup => this.setState({ currentVideoGroup: videoGroup })}
					/>
				}

				<Grid item xs={12}>
					<VideoList videos={this.getVideos()} />
				</Grid>
			</Grid>
		);
	}
}
