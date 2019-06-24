import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'gatsby';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  link: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
    marginLeft: theme.spacing(4),
    textTransform: 'uppercase',
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.5rem',
  },
  active: {
    borderBottom: '1px solid',
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

const Navigation = (props) => {
  const { location, resume } = props;
  const classes = useStyles(props);
  const [menuAnchor, setAnchor] = useState(null);

  return (
    <div className={classes.container}>
      <Link
        to="/about"
        className={classes.link}
        activeClassName={classes.active}
      >
        About
      </Link>

      <Link
        to="/engagements"
        className={classes.link}
        activeClassName={classes.active}
      >
        Engagements
      </Link>

      <div
        aria-owns={menuAnchor ? 'Media-Menu' : null}
        aria-haspopup="true"
        aria-label="Media Menu"
        style={{ cursor: 'pointer' }}
      >
        <div
          role="button"
          tabIndex={-1}
          className={classes.link}
          onClick={event => setAnchor(event.currentTarget)}
          onKeyPress={(event) => {
            if (event.charCode === 13) {
              setAnchor(event.currentTarget);
            }
          }}
        >
          Media
        </div>

        <Menu
          id="Media-Menu"
          classes={{ paper: classes.menu }}
          anchorEl={menuAnchor}
          open={!!menuAnchor}
          onClose={() => setAnchor(null)}
          value={0}
        >
          <Link to="/photos" style={{ textDecoration: 'none' }}>
            <MenuItem
              onClick={() => setAnchor(null)}
              className={classes.menuLink}
              selected={location.pathname === '/photos'}
            >
              Photos
            </MenuItem>
          </Link>

          <Link
            to="/media"
            style={{ textDecoration: 'none' }}
          >
            <MenuItem
              onClick={() => setAnchor(null)}
              className={classes.menuLink}
              selected={location.pathname === '/media'}
            >
              Recordings
            </MenuItem>
          </Link>
        </Menu>
      </div>

      <Link
        to="/lessons"
        className={classes.link}
        activeClassName={classes.active}
      >
        Lessons
      </Link>

      <a href={resume} className={classes.link}>
        Resume
      </a>

      <Link
        to="/contact"
        className={classes.link}
        activeClassName={classes.active}
      >
        Contact
      </Link>
    </div>
  );
};

Navigation.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  resume: PropTypes.string.isRequired,
};

export default Navigation;
