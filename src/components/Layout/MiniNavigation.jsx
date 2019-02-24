import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import MenuIcon from 'mdi-material-ui/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class MiniNavigationCore extends React.Component {
  constructor(props) {
    super(props);

    this.state = { menuAnchor: null };
  }

  render() {
    const { classes, location, resume } = this.props;
    const { menuAnchor } = this.state;

    return (
      <div>
        <Fab
          size="small"
          aria-owns={menuAnchor ? 'Navigation' : null}
          aria-haspopup="true"
          aria-label="Navigation Menu"
          color="secondary"
          classes={{ root: classes.button }}
          onClick={event => this.setState({ menuAnchor: event.currentTarget })}
        >
          <MenuIcon />
        </Fab>

        <Menu
          id="Navigation"
          classes={{ paper: classes.menu }}
          anchorEl={menuAnchor}
          open={!!menuAnchor}
          onEnter={() => document.activeElement.blur()}
          onClose={() => this.setState({ menuAnchor: null })}
        >
          <MenuItem
            onClick={() => {
              this.setState({ menuAnchor: null });
              navigate('/about');
            }}
            className={classes.menuLink}
            selected={location.pathname === '/about'}
          >
              About
          </MenuItem>

          <MenuItem
            onClick={() => {
              this.setState({ menuAnchor: null });
              navigate('/engagements');
            }}
            className={classes.menuLink}
            selected={location.pathname === '/engagements'}
          >
              Engagements
          </MenuItem>

          <MenuItem
            onClick={() => {
              this.setState({ menuAnchor: null });
              navigate('/photos');
            }}
            className={classes.menuLink}
            selected={location.pathname === '/photos'}
          >
              Photos
          </MenuItem>

          <MenuItem
            onClick={() => {
              this.setState({ menuAnchor: null });
              navigate('/media');
            }}
            className={classes.menuLink}
            selected={location.pathname === '/media'}
          >
              Recordings
          </MenuItem>

          <MenuItem
            onClick={() => {
              this.setState({ menuAnchor: null });
              navigate('/lessons');
            }}
            className={classes.menuLink}
            selected={location.pathname === '/lessons'}
          >
            Lessons
          </MenuItem>

          <a href={resume} style={{ textDecoration: 'none' }}>
            <MenuItem
              onClick={() => this.setState({ menuAnchor: null })}
              className={classes.menuLink}
              selected={location.pathname === '/resume'}
            >
              Resume
            </MenuItem>
          </a>

          <MenuItem
            onClick={() => {
              this.setState({ menuAnchor: null });
              navigate('/contact');
            }}
            className={classes.menuLink}
            selected={location.pathname === '/contact'}
          >
              Contact
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

MiniNavigationCore.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string,
    menu: PropTypes.string,
    menuLink: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  resume: PropTypes.string.isRequired,
};

const styles = theme => ({
  button: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.contrastText}`,
    borderRadius: '2px',
    color: theme.palette.primary.contrastText,

    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  menu: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  menuLink: {
    color: theme.palette.primary.contrastText,
    textTransform: 'uppercase',
  },
});

export default withStyles(styles)(MiniNavigationCore);
