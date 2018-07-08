import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Title = props => (
	<div className={props.classes.container}>
		<Typography variant='display1' className={props.classes.title}>
			{props.children}
		</Typography>
	</div>
);

const styles = theme => ({
	container: {
		display: 'flex',
		justifyContent: 'center'
	},
	title: {
		display: 'inline-block',
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText,
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`
	}
});

export default withStyles(styles)(Title);