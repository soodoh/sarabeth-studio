import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import MenuIcon from 'mdi-material-ui/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class MiniNavigation extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = { menuAnchor: null };
	}
	
	render() {
		const { classes, match } = this.props;
		
		return (
			<div>
				<Button variant='fab' mini
				        aria-owns={this.state.menuAnchor ? 'Navigation' : null}
				        aria-haspopup="true"
				        color='secondary'
				        classes={{root: classes.button}}
				        onClick={event => this.setState({ menuAnchor: event.currentTarget })}
				>
					<MenuIcon />
				</Button>
				
				<Menu id='Navigation'
				      classes={{ paper: classes.menu }}
				      anchorEl={this.state.menuAnchor}
				      open={!!this.state.menuAnchor}
				      onEnter={() => document.activeElement.blur()}
				      onClose={() => this.setState({ menuAnchor: null })}
				>
					<NavLink to='/about' style={{ textDecoration: 'none' }}>
						<MenuItem onClick={() => this.setState({ mediaAnchor: null })}
						          className={classes.menuLink}
						          selected={match.path === '/about'}
						>
							About
						</MenuItem>
					</NavLink>
					
					<NavLink to='/engagements' style={{ textDecoration: 'none' }}>
						<MenuItem onClick={() => this.setState({ mediaAnchor: null })}
						          className={classes.menuLink}
						          selected={match.path === '/engagements'}
						>
							Engagements
						</MenuItem>
					</NavLink>
					
					<NavLink to='/photos' style={{ textDecoration: 'none' }}>
						<MenuItem onClick={() => this.setState({ mediaAnchor: null })}
						          className={classes.menuLink}
						          selected={match.path === '/photos'}
						>
							Photos
						</MenuItem>
					</NavLink>
					
					<NavLink to='/audio' style={{ textDecoration: 'none' }}>
						<MenuItem onClick={() => this.setState({ mediaAnchor: null })}
						          className={classes.menuLink}
						          selected={match.path === '/audio'}
						>
							Audio
						</MenuItem>
					</NavLink>
					
					<NavLink to='/resume' style={{ textDecoration: 'none' }}>
						<MenuItem onClick={() => this.setState({ mediaAnchor: null })}
						          className={classes.menuLink}
						          selected={match.path === '/resume'}
						>
							Resume
						</MenuItem>
					</NavLink>
				</Menu>
			</div>
		);
	}
}

const styles = theme => ({
	button: {
		backgroundColor: 'transparent',
		border: `1px solid ${theme.palette.primary.contrastText}`,
		borderRadius: '2px',
		color: theme.palette.primary.contrastText,
		
		'&:focus': {
			backgroundColor: 'transparent'
		}
	},
	menu: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText
	},
	menuLink: {
		color: theme.palette.primary.contrastText,
		textTransform: 'uppercase'
	}
});

export default withStyles(styles)(MiniNavigation);