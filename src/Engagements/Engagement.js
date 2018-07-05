import React from 'react';
import Moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Engagement = props => {
	const { classes, data } = props;
	const isUpcoming = Moment(data.fields.endDate).isBefore(Moment());
	const startDate = Moment(data.fields.startDate).format('MMMM Do');
	const endDate = Moment(data.fields.endDate).format('MMMM Do, YYYY');
	
	return (
		<Grid container
		      spacing={8}
		      className={classes.container}
		>
			<Grid item xs={12} sm={4}>
				<Typography variant='headline' color='inherit'>
					{data.fields.role}
				</Typography>
			</Grid>
			
			<Grid item xs={12} sm={6}>
				<Typography variant='headline' color='inherit'>
					{data.fields.label}
				</Typography>
				
				<Typography variant='subheading' color='inherit'>
					{data.fields.company}
				</Typography>
				
				<Typography variant='body2' color='inherit'>
					{`${startDate} - ${endDate}`}
				</Typography>
			</Grid>
			
			<Grid item xs={12} sm={2}>
				<Button variant='outlined'
				        className={classes.button}
				        onClick={() => window.location.href=data.fields.link}
				>
					{isUpcoming ? 'Buy Tickets' : 'Learn More'}
				</Button>
			</Grid>
		</Grid>
	);
};

const styles = theme => ({
	container: {
		color: theme.palette.primary.contrastText,
		margin: theme.spacing.unit * 4
	},
	button: {
		color: theme.palette.primary.contrastText,
		border: `1px solid ${theme.palette.primary.contrastText}`,
		borderRadius: 0
	}
});

export default withStyles(styles)(Engagement);