import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Play from 'mdi-material-ui/Play';
import Pause from 'mdi-material-ui/Pause';

class AudioPlayer extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isPlaying: false,
			currentTime: 0
		};
		this.audioPlayer = React.createRef();
		this.togglePlayer = this.togglePlayer.bind(this);
		this.formatTimecode = this.formatTimecode.bind(this);
		this.seekTime = this.seekTime.bind(this);
	}
	
	togglePlayer() {
		if(this.state.isPlaying) {
			this.audioPlayer.current.pause();
		} else {
			this.audioPlayer.current.play();
		}
		this.setState({ isPlaying: !this.state.isPlaying });
	}
	
	formatTimecode(time) {
		const minutes = Math.floor(time / 60)
			.toString().padStart(2, '0');
		const seconds = Math.floor(time % 60)
			.toString().padStart(2, '0');
		
		return `${minutes}:${seconds}`;
	}
	
	seekTime(event) {
		// Page X calculations
		const mouseX = event.pageX;
		const parentX = event.currentTarget.offsetLeft;
		const parentWidth = event.currentTarget.offsetWidth;
		// Useful values
		const percentage = (mouseX - parentX) / parentWidth;
		const duration = this.audioPlayer.current.duration;
		const newTime = duration * percentage;
		
		this.setState({ currentTime: newTime });
		this.audioPlayer.current.currentTime = newTime;
	}
	
	render() {
		const { classes, url } = this.props;
		const duration = this.audioPlayer.current ? this.audioPlayer.current.duration : 1;
		
		return (
			<div className={classes.container}>
				<div>
					<audio ref={this.audioPlayer}
					       onTimeUpdate={() => this.setState({ currentTime: this.audioPlayer.current.currentTime })}
					>
						<source src={url} type="audio/mp3" />
					</audio>
				</div>
				
				<div className={classes.button}
				     onClick={this.togglePlayer}>
					{this.state.isPlaying ?
						<Pause /> : <Play />
					}
				</div>
				
				<Typography variant='body2' color='inherit' className={classes.timecode}>
					{this.formatTimecode(this.state.currentTime)}
				</Typography>
				
				<LinearProgress classes={{ root: classes.progress, bar1Determinate: classes.progressBar }}
				                onClick={this.seekTime}
				                variant='determinate'
				                color='primary'
				                value={this.state.currentTime / duration * 100}
				/>
			</div>
		);
	}
}

const styles = theme => ({
	container: {
		width: '100%',
		backgroundColor: theme.palette.secondary.main,
		padding: theme.spacing.unit,
		display: 'flex',
		alignItems: 'center'
	},
	button: {
		color: theme.palette.secondary.contrastText
	},
	timecode: {
		color: theme.palette.secondary.contrastText,
		padding: `0 ${theme.spacing.unit * 2}px`
	},
	progress: {
		flex: 1,
		height: theme.spacing.unit,
		cursor: 'pointer',
		marginRight: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.contrastText
	},
	progressBar: {
		backgroundColor: theme.palette.primary.contrastText
	}
});

export default withStyles(styles)(AudioPlayer);