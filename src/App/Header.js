import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink, withRouter } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MiniNavigation from './MiniNavigation';
import Navigation from './Navigation';

class Header extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			menuAnchor: null,
			mediaAnchor: null
		};
	}
	
	render() {
		const { classes, match } = this.props;
		
		return (
			<AppBar position='sticky' className={match.path === '/' && match.isExact ? classes.transparent : classes.appBar}>
				<Toolbar>
					<Typography variant='title' color='inherit' className={classes.brand}>
						<NavLink to='/'>
							Sarabeth Belon
						</NavLink>
					</Typography>
					
					<Hidden smDown>
						<Navigation match={match} />
					</Hidden>
					<Hidden mdUp>
						<MiniNavigation match={match} />
					</Hidden>
				</Toolbar>
			</AppBar>
		);
	}
}

const styles = theme => ({
	appBar: {
		backgroundColor: theme.palette.primary.main
	},
	transparent: {
		backgroundColor: 'transparent',
		boxShadow: 'none'
	},
	brand: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		fontSize: '2rem',
		
		'& a': {
			textDecoration: 'none',
			color: 'inherit'
		}
	},
	
});

export default withRouter(withStyles(styles)(Header));