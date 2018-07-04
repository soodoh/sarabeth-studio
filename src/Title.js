import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Title = props => (
	<Typography variant='display1' align='center'>
		<span className={props.classes.title}>
			{props.children}
		</span>
	</Typography>
);

const styles = theme => ({
	title: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText,
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`
	}
});

export default withStyles(styles)(Title);