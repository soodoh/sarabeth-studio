import React from 'react';
import AudioPlayer from 'react-responsive-audio-player';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Song = props => {
	const { classes, title, subtitle, url } = props;
	
	return (
		<div className={classes.container}>
			<div className={classes.metadata}>
				<Typography variant='body2' className={classes.title}>
					{title}
				</Typography>
				
				<Typography variant='body2' className={classes.subtitle}>
					{subtitle}
				</Typography>
			</div>
			
			<AudioPlayer playlist={[{ url, title: `${title} - ${subtitle}` }]}
			             className={classes.player}
			/>
		</div>
	);
};

const styles = theme => ({
	container: {
		margin: theme.spacing.unit * 4
	},
	metadata: {
		display: 'flex'
	},
	title: {
		color: theme.palette.secondary.main
	},
	subtitle: {
		color: theme.palette.primary.contrastText,
		marginLeft: theme.spacing.unit * 2
	},
	player: {
		// backgroundColor: 'red'
	}
});

export default withStyles(styles)(Song);