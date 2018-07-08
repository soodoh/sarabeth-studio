import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class Navigation extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = { menuAnchor: null };
	}
	
	render() {
		const { classes, match } = this.props;
		
		return (
			<div className={classes.container}>
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
				
				<div aria-owns={this.state.menuAnchor ? 'Media-Menu' : null}
				     aria-haspopup="true"
				     style={{ cursor: 'pointer' }}
				>
					<div className={classes.link}
					     onClick={event => this.setState({ menuAnchor: event.currentTarget })}
					>
						Media
					</div>
					
					<Menu id='Media-Menu'
					      classes={{ paper: classes.menu }}
					      anchorEl={this.state.menuAnchor}
					      open={!!this.state.menuAnchor}
					      onEnter={() => document.activeElement.blur()}
					      onClose={() => this.setState({ menuAnchor: null })}
					      value={0}
					>
						<NavLink to='/photos' style={{ textDecoration: 'none' }}>
							<MenuItem onClick={() => this.setState({ menuAnchor: null })}
							          className={classes.menuLink}
							          selected={match.path === '/photos'}
							>
								Photos
							</MenuItem>
						</NavLink>
						
						<NavLink to='/audio' style={{ textDecoration: 'none' }}>
							<MenuItem onClick={() => this.setState({ menuAnchor: null })}
							          className={classes.menuLink}
							          selected={match.path === '/audio'}
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
				
				<NavLink to='/contact'
				         className={classes.link}
				         activeClassName={classes.active}
				>
					Contact
				</NavLink>
			</div>
		);
	}
}

const styles = theme => ({
	container: {
		display: 'flex',
		
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
	menu: {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText
	},
	menuLink: {
		color: theme.palette.primary.contrastText,
		textTransform: 'uppercase'
	}
});

export default withStyles(styles)(Navigation);