import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

const Filters = props => {
	const { classes, list, activeItem, onClick } = props;
	
	return (
		<div className={classes.buttonGroup}>
			{list.map((item, index) => (
				<Button key={index}
				        variant='raised'
				        className={activeItem === item ? classes.active : classes.button}
				        onClick={() => onClick(item)}
				>
					{item}
				</Button>
			))}
		</div>
	);
};

const styles = theme => ({
	buttonGroup: {
		display: 'flex',
		justifyContent: 'space-around',
		flexWrap: 'wrap',
		marginTop: theme.spacing.unit * 4,
		width: '100%'
	},
	button: {
		backgroundColor: theme.palette.secondary.dark,
		color: theme.palette.primary.contrastText,
		borderRadius: 0,
		margin: theme.spacing.unit,
		
		'&:hover': {
			backgroundColor: 'transparent'
		}
	},
	active: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: 0,
		margin: theme.spacing.unit,
		
		'&:hover': {
			backgroundColor: theme.palette.primary.light
		}
	}
});

export default withStyles(styles)(Filters);