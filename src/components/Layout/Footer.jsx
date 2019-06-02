import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import SocialMedia from '../common/SocialMedia';

const useStyles = makeStyles(theme => ({
  footer: {
    flexShrink: 0,
    width: '100%',
    height: 'auto',
    zIndex: 1,
    color: theme.palette.primary.contrastText,
  },
  content: {
    display: 'flex',
    height: '100%',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 2),

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
    },
  },
  leftGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
}));

const Footer = (props) => {
  const { location } = props;
  const classes = useStyles(props);

  return (
    <footer className={classes.footer}>
      <section className={classes.content}>
        <div className={classes.leftGroup}>
          {location && (
            <Typography variant="caption" color="inherit">
              {location}
            </Typography>
          )}
          <Typography variant="caption" color="inherit">
            Copyright &copy;
            {' '}
            {new Date().getFullYear()}
            {' '}
            Sarabeth Belon
          </Typography>
        </div>

        <div className={classes.buttons}>
          <SocialMedia />
        </div>

        <div className={classes.rightGroup}>
          <Typography variant="caption" color="inherit">
            Designed by Carolyn DiLoreto

          </Typography>
          <Typography variant="caption" color="inherit">
            Developed by Paul DiLoreto

          </Typography>
        </div>
      </section>
    </footer>
  );
};
Footer.propTypes = {
  location: PropTypes.string,
};
Footer.defaultProps = {
  location: null,
};

export default () => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        contentfulAbout {
          location
        }
      }
    `}
    render={data => (
      <Footer location={data.contentfulAbout.location} />
    )}
  />
);
