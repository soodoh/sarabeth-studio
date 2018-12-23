import React from 'react';
import Videos from './Videos/VideosPage';
import Audio from './Audio/AudioPage';
import { withStyles } from '@material-ui/core/styles';

const MediaCore = (props) => {
	const { classes } = props;

	return (
		<div className={classes.container}>
			<Videos />
			<Audio />
		</div>
	);
};

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 4,
	},
});

export default withStyles(styles)(MediaCore);
