import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from 'mdi-material-ui/Menu';
import ArrowRight from 'mdi-material-ui/ChevronRight';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  button: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.contrastText}`,
    borderRadius: '2px',
    color: theme.palette.primary.contrastText,

    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  list: {
    width: theme.spacing(30),
  },
  listText: {
    color: theme.palette.secondary.dark,
    textTransform: 'uppercase',
  },
  drawerTop: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: theme.spacing(0.5),
  },
  drawer: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
}));

const MiniNavigation = (props) => {
  const { location, resume } = props;
  const classes = useStyles(props);
  const [isActive, setActive] = useState(false);
  const links = [
    { label: 'About', url: '/about' },
    { label: 'Engagements', url: '/engagements' },
    { label: 'Photos', url: '/photos' },
    { label: 'Recordings', url: '/media' },
    { label: 'Resume', url: resume, component: 'a' },
    { label: 'Contact', url: '/contact' },
  ];

  return (
    <React.Fragment>
      <Fab
        size="small"
        color="secondary"
        classes={{ root: classes.button }}
        className={classes.buttonContainer}
        onClick={() => setActive(true)}
      >
        <MenuIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={isActive}
        classes={{ paper: classes.drawer }}
        onClose={() => setActive(false)}
        // ModalProps={{ disableRestoreFocus: true }}
      >
        <div className={classes.drawerTop}>
          <IconButton
            color="primary"
            onClick={() => setActive(false)}
          >
            <ArrowRight />
          </IconButton>
        </div>

        <List className={classes.list}>
          {links.map(({ label, url, component }) => (
            <ListItem
              key={`mobile-${label}`}
              button
              divider
              selected={location.pathname === url}
              color="primary"
              onClick={() => setActive(false)}
              component={component || Link}
              {...component ? { href: url } : { to: url }}
            >
              <ListItemText
                primary={label}
                classes={{ primary: classes.listText }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </React.Fragment>
  );
};

MiniNavigation.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  resume: PropTypes.string.isRequired,
};

export default MiniNavigation;
