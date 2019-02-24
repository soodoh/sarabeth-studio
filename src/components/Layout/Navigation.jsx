import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class NavigationCore extends React.Component {
  constructor(props) {
    super(props);

    this.state = { menuAnchor: null };
    this.openMenu = this.openMenu.bind(this);
  }

  openMenu(event) {
    this.setState({ menuAnchor: event.currentTarget });
  }

  render() {
    const { menuAnchor } = this.state;
    const { classes, location, resume } = this.props;

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
            onClick={this.openMenu}
            onKeyPress={(event) => {
              if (event.charCode === 13) {
                this.openMenu(event);
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
            onEnter={() => document.activeElement.blur()}
            onClose={() => this.setState({ menuAnchor: null })}
            value={0}
          >
            <Link to="/photos" style={{ textDecoration: 'none' }}>
              <MenuItem
                onClick={() => this.setState({ menuAnchor: null })}
                className={classes.menuLink}
                selected={location.path === '/photos'}
              >
                Photos
              </MenuItem>
            </Link>

            <Link
              to="/media"
              style={{ textDecoration: 'none' }}
            >
              <MenuItem
                onClick={() => this.setState({ menuAnchor: null })}
                className={classes.menuLink}
                selected={location.path === '/media'}
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
  }
}

NavigationCore.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  resume: PropTypes.string.isRequired,
};

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
});

export default withStyles(styles)(NavigationCore);
