import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Header extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = { menuAnchor: null };
	}
	
	render() {
		const { classes, match } = this.props;
		const NavLinks = [
			{ label: 'About', path: '/about' },
			{ label: 'Engagements', path: '/engagements' },
			{ label: 'Media', path: '/media' },
			{ label: 'Resume', path: '/resume' }
		];
		
		return (
			<AppBar position='sticky' className={match.path === '/' ? classes.transparent : classes.appBar}>
				<Toolbar>
					<Typography variant='title' color='inherit' className={classes.brand}>
						<NavLink to='/'>
							Sarabeth Belon
						</NavLink>
					</Typography>
					
					<Hidden smDown>
						{NavLinks.map((link, index) => (
							<NavLink to={link.path}
							         key={index}
							         className={classes.link}
							         activeClassName={classes.active}
							>
								{link.label}
							</NavLink>
						))}
					</Hidden>
					<Hidden mdUp>
						<Button variant='fab' mini
						        aria-owns={this.state.menuAnchor ? 'Navigation' : null}
						        aria-haspopup="true"
						        color='secondary'
						        classes={{root: classes.navMenu}}
						        onClick={event => this.setState({ menuAnchor: event.currentTarget })}
						>
							<MenuIcon />
						</Button>
						
						<Menu id='Navigation'
						      anchorEl={this.state.menuAnchor}
						      open={!!this.state.menuAnchor}
						      onClose={() => this.setState({ menuAnchor: null })}
						>
							{NavLinks.map((link, index) => (
								<NavLink to={link.path}
								         key={index}
								         className={classes.menuLink}
								>
									<MenuItem onClick={() => this.setState({ menuAnchor: null })}>
										{link.label}
									</MenuItem>
								</NavLink>
							))}
						</Menu>
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
	link: {
		color: theme.palette.primary.contrastText,
		textDecoration: 'none',
		marginLeft: theme.spacing.unit * 4,
		textTransform: 'uppercase',
		fontFamily: theme.typography.fontFamily,
		lineHeight: '1.5rem'
	},
	active: {
		borderBottom: `1px solid`
	},
	navMenu: {
		backgroundColor: 'transparent',
		border: `1px solid ${theme.palette.secondary.main}`,
		borderRadius: '2px',
		
		'&:focus': {
			backgroundColor: 'transparent'
		}
	},
	menuLink: {
		color: theme.palette.primary.main,
		textDecoration: 'none',
	}
});

export default withStyles(styles)(Header);