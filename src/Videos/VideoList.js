import React from 'react';
import Video from './Video';
import Masonry from 'react-masonry-component';
import Player from 'react-player';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
	return <Slide direction='up' {...props} />;
}

class VideoList extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			videoActive: false,
			currentVideo: 0
		};
	}
	
	render() {
		const { classes, videos, ...other } = this.props;
		
		return (
			<Masonry {...other}>
				<Dialog open={this.state.videoActive}
				        maxWidth='md'
				        fullWidth
				        onClose={() => this.setState({ videoActive: false })}
				        TransitionComponent={Transition}
				>
					<div className={classes.playerContainer}>
						<Player url={videos[this.state.currentVideo].url}
						        controls
						        className={classes.player}
						        width='100%'
						        height='100%'
						/>
					</div>
					
				</Dialog>
				
				{Array.isArray(videos) && videos.map((video, index) => (
					<Video key={index}
					       coverImage={video.coverImage}
					       title={video.title}
					       onClick={() => this.setState({ currentVideo: index, videoActive: true})}
					/>
				))}
			</Masonry>
		);
	}
}

const styles = theme => ({
	playerContainer: {
		position: 'relative',
		paddingTop: '56.25%',
		overflow: 'hidden'
	},
	player: {
		position: 'absolute',
		top: 0, left: 0
	}
});

export default withStyles(styles)(VideoList);