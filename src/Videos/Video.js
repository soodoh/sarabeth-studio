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
			<div className={classes.container}>
				<div className={classes.videoContainer}
				     onClick={onClick}
				     onMouseEnter={() => this.setState({ labelActive: true })}
				     onMouseLeave={() => this.setState({ labelActive: false })}
				>
					<img src={`${coverImage}?w=400`}
					     alt={title}
					     className={classes.thumbnail}
					/>
					<Fade in={detectIt.deviceType === 'touchOnly' || this.state.labelActive}>
						<GridListTileBar className={classes.label}
						                 title={<PlayIcon style={{ fontSize: '2.5rem' }} />}
						                 subtitle={<Typography variant='body2' color='inherit'>{title}</Typography>}
						/>
					</Fade>
				</div>
			</div>
		);
	}
}

const styles = theme => ({
	thumbnail: {
		width: `100%`,
		height: 'auto',
		verticalAlign: 'top' // Removes bottom gutter for Masonry
	},
	videoContainer: {
		position: 'relative',
		cursor: 'pointer',
		overflow: 'hidden'
	},
	label: {
		height: '100%',
		width: '100%',
		display: 'flex',
		textAlign: 'center',
		alignItems: 'center'
	},
	// Breakpoints
	[`@media (min-width: ${theme.breakpoints.values.xs}px)`]: {
		container: {
			width: '50%'
		},
		videoContainer: {
			margin: theme.spacing.unit / 2
		}
	},
	[`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
		container: {
			width: '33.33%'
		},
		videoContainer: {
			margin: theme.spacing.unit * 2
		}
	},
	[`@media (min-width: ${theme.breakpoints.values.lg}px)`]: {
		container: {
			width: '25%'
		}
	}
});

export default withStyles(styles)(Video);