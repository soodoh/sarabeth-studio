import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql, Link } from 'gatsby';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ReactSvg from 'react-svg';
import Navigation from './Navigation';
import MiniNavigation from './MiniNavigation';
import { transitionDelay } from './PageTransition';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.primary.main,
    flexShrink: 0,
    transition: `background-color ${transitionDelay}ms ease-in-out`,
  },
  transparent: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    transition: `background-color ${transitionDelay}ms ease-in-out`,
  },
  brandText: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    fontSize: '2rem',
    fontFamily: theme.typography.h3.fontFamily,

    [theme.breakpoints.down('xs')]: {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      left: 0,
      width: '100%',
      justifyContent: 'center',
      zIndex: -1,
    },
  },
  brandContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
  },
  logoSvg: {
    width: 100,
    height: '100%',
    marginRight: theme.spacing(1),

    '& path': {
      fill: theme.palette.primary.contrastText,
    },

    [theme.breakpoints.down('xs')]: {
      width: 60,
    },
  },
}));

const Header = (props) => {
  const {
    location,
    logo,
    resume,
  } = props;
  const classes = useStyles(props);
  const isHome = location.pathname === '/';

  return (
    <AppBar
      position="sticky"
      className={classNames({
        [classes.appBar]: true,
        [classes.transparent]: isHome,
      })}
    >
      <Toolbar>
        <div className={classes.brandContainer}>
          {!isHome && (
            <Link to="/">
              <ReactSvg
                src={logo}
                beforeInjection={(svg) => {
                  svg.classList.add(classes.logoSvg);
                }}
              />
            </Link>
          )}
          {!isHome && (
          <Typography
            className={classes.brandText}
            variant="h6"
            color="inherit"
          >
            Sarabeth Belón
          </Typography>
          )}
        </div>

        <Navigation
          location={location}
          resume={resume}
        />

        <MiniNavigation
          location={location}
          resume={resume}
        />
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  logo: PropTypes.string.isRequired,
  resume: PropTypes.string.isRequired,
};

const HeaderWithData = ({ location }) => (
  <StaticQuery
    query={graphql`
      query HeaderQuery {
        contentfulAbout {
          resume {
            file {
              url
            }
          }
          brandLogo {
            file {
              url
            }
          }
        }
      }
    `}
    render={(data) => (
      <Header
        location={location}
        logo={data.contentfulAbout.brandLogo.file.url}
        resume={data.contentfulAbout.resume.file.url}
      />
    )}
  />
);
HeaderWithData.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default HeaderWithData;
