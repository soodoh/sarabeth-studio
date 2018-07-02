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
import Divider from '@material-ui/core/Divider';

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
		const NavLinks = [
			{ label: 'About', path: '/about' },
			{ label: 'Engagements', path: '/engagements' },
			{ label: 'Media', path: '/media' },
			{ label: 'Resume', path: '/resume' }
		];
		
		return (
			<AppBar position='sticky' className={match.path === '/' && match.isExact ? classes.transparent : classes.appBar}>
				<Toolbar>
					<Typography variant='title' color='inherit' className={classes.brand}>
						<NavLink to='/'>
							Sarabeth Belon
						</NavLink>
					</Typography>
					
					<Hidden smDown>
						<NavLink to='/about'
						         className={classes.link}
						         activeClassName={classes.active}
						>
							About
						</NavLink>
						
						<NavLink to='/engagements'
						         className={classes.link}
						         activeClassName={classes.active}
						>
							Engagements
						</NavLink>
						
						<div aria-owns={this.state.mediaAnchor ? 'Media-Menu' : null}
						     aria-haspopup="true"
						     className={classes.mediaLink}
						>
							<div className={classes.link}
							     onClick={event => this.setState({ mediaAnchor: event.currentTarget })}
							>
								Media
							</div>
							
							<Menu id='Media-Menu'
							      classes={{ paper: classes.mediaMenu }}
							      anchorEl={this.state.mediaAnchor}
							      open={!!this.state.mediaAnchor}
							      onClose={() => this.setState({ mediaAnchor: null })}
							>
								<NavLink to='/photos'>
									<MenuItem onClick={() => this.setState({ mediaAnchor: null })}
									          className={classes.menuLink}
									>
										Photos
									</MenuItem>
								</NavLink>
								
								<Divider className={classes.menuLink} />
								
								<NavLink to='/audio'>
									<MenuItem onClick={() => this.setState({ mediaAnchor: null })}
									          className={classes.menuLink}
									>
										Audio
									</MenuItem>
								</NavLink>
							</Menu>
						</div>
						
						<NavLink to='/resume'
						         className={classes.link}
						         activeClassName={classes.active}
						>
							Resume
						</NavLink>
					</Hidden>
					<Hidden mdUp>
						<Button variant='fab' mini
						        aria-owns={this.state.menuAnchor ? 'Navigation' : null}
						        aria-haspopup="true"
						        color='secondary'
						        classes={{root: classes.miniMenu}}
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
	mediaLink: {
		cursor: 'pointer'
	},
	mediaMenu: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText
	},
	miniMenu: {
		backgroundColor: 'transparent',
		border: `1px solid ${theme.palette.secondary.main}`,
		borderRadius: '2px',
		
		'&:focus': {
			backgroundColor: 'transparent'
		}
	},
	menuLink: {
		color: theme.palette.primary.contrastText,
		textDecoration: 'none',
	}
});

export default withStyles(styles)(Header);