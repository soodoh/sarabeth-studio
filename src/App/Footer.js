import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SocialMedia from '../SocialMedia';
import Typography from '@material-ui/core/Typography';

const Footer = props => {
	const { classes } = props;
	
	return (
		<footer className={classes.footer}>
			<section className={classes.content}>
				<Typography variant='caption' color='inherit'>
					Copyright &copy; {new Date().getFullYear()} Sarabeth Belon
				</Typography>
				
				<SocialMedia />
				
				<div>
					<Typography variant='caption' color='inherit'>
						Designed by Carolyn DiLoreto
					</Typography>
					<Typography variant='caption' color='inherit'>
						Developed by Paul DiLoreto
					</Typography>
				</div>
			</section>
		</footer>
	);
};

const styles = theme => ({
	footer: {
		width: '100%',
		height: theme.spacing.unit * 11,
		position: 'absolute',
		bottom: 0,
		color: theme.palette.primary.contrastText
	},
	content: {
		display: 'flex',
		height: '100%',
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: `0 ${theme.spacing.unit * 2}px`
	}
});

export default withStyles(styles)(Footer);