import React from 'react';
import Videos from './Videos';
import Audio from './Audio';
import { withStyles } from '@material-ui/core/styles';

const Media = props => {
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
		padding: theme.spacing.unit * 4
	}
});

export default withStyles(styles)(Media);