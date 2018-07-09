import React from 'react';
import detectIt from "detect-it";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Fade from '@material-ui/core/Fade';
import PlayIcon from 'mdi-material-ui/Play';

class Video extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			labelActive: detectIt.deviceType === 'touchOnly'
		};
	}
	
	render() {
		const { classes, coverImage, title, onClick } = this.props;
		
		return (
			<div className={classes.videoContainer}
			     onClick={onClick}
			     onMouseEnter={() => this.setState({ labelActive: true })}
			     onMouseLeave={() => this.setState({ labelActive: false })}
			>
				<img src={`${coverImage}?w=400`}
				     alt={title}
				     className={classes.video}
				/>
				<Fade in={detectIt.deviceType === 'touchOnly' || this.state.labelActive}>
					<GridListTileBar className={classes.label}
					                 title={<PlayIcon style={{ fontSize: '2.5rem' }} />}
					                 subtitle={<Typography variant='body2' color='inherit'>{title}</Typography>}
					/>
				</Fade>
			</div>
		);
	}
}

const styles = theme => ({
	video: {
		padding: theme.spacing.unit * 2,
		width: `calc(100% - ${theme.spacing.unit * 4}px)`,
		verticalAlign: 'top' // Removes bottom gutter for Masonry
	},
	videoContainer: {
		height: 'auto',
		padding: 0,
		margin: 0,
		cursor: 'pointer'
	},
	label: {
		color: theme.palette.common.white,
		height: '100%',
		display: 'flex',
		textAlign: 'center',
		alignItems: 'center'
	},
	// Breakpoints
	[`@media (min-width: ${theme.breakpoints.values.xs}px)`]: {
		videoContainer: {
			width: '50%'
		}
	},
	[`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
		videoContainer: {
			width: '33.33%'
		}
	},
	[`@media (min-width: ${theme.breakpoints.values.lg}px)`]: {
		videoContainer: {
			width: '25%'
		}
	}
});

export default withStyles(styles)(Video);