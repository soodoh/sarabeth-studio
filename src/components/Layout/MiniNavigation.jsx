import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import MenuIcon from 'mdi-material-ui/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
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
}));

const MiniNavigation = (props) => {
  const { location, resume } = props;
  const classes = useStyles(props);
  const [menuAnchor, setAnchor] = useState(null);

  return (
    <div>
      <Fab
        size="small"
        aria-owns={menuAnchor ? 'Navigation' : null}
        aria-haspopup="true"
        aria-label="Navigation Menu"
        color="secondary"
        classes={{ root: classes.button }}
        onClick={event => setAnchor(event.currentTarget)}
      >
        <MenuIcon />
      </Fab>

      <Menu
        id="Navigation"
        classes={{ paper: classes.menu }}
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onEnter={() => document.activeElement.blur()}
        onClose={() => setAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
          }}
          component={Link}
          to="/about"
          className={classes.menuLink}
          selected={location.pathname === '/about'}
        >
            About
        </MenuItem>

        <MenuItem
          onClick={() => setAnchor(null)}
          component={Link}
          to="/engagements"
          className={classes.menuLink}
          selected={location.pathname === '/engagements'}
        >
          Engagements
        </MenuItem>

        <MenuItem
          onClick={() => setAnchor(null)}
          component={Link}
          to="/photos"
          className={classes.menuLink}
          selected={location.pathname === '/photos'}
        >
            Photos
        </MenuItem>

        <MenuItem
          onClick={() => setAnchor(null)}
          component={Link}
          to="/media"
          className={classes.menuLink}
          selected={location.pathname === '/media'}
        >
            Recordings
        </MenuItem>

        <MenuItem
          onClick={() => setAnchor(null)}
          component={Link}
          to="/lessons"
          className={classes.menuLink}
          selected={location.pathname === '/lessons'}
        >
          Lessons
        </MenuItem>

        <MenuItem
          onClick={() => setAnchor(null)}
          component="a"
          href={resume}
          className={classes.menuLink}
          selected={location.pathname === '/resume'}
        >
          Resume
        </MenuItem>

        <MenuItem
          onClick={() => setAnchor(null)}
          component={Link}
          to="/contact"
          className={classes.menuLink}
          selected={location.pathname === '/contact'}
        >
            Contact
        </MenuItem>
      </Menu>
    </div>
  );
};

MiniNavigation.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  resume: PropTypes.string.isRequired,
};

export default MiniNavigation;
