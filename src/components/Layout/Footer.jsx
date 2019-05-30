import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SocialMedia from '../common/SocialMedia';

const FooterCore = (props) => {
  const { classes, location } = props;

  return (
    <footer className={classes.footer}>
      <section className={classes.content}>
        <div>
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

        <div>
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
FooterCore.propTypes = {
  classes: PropTypes.shape({
    footer: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  location: PropTypes.string,
};
FooterCore.defaultProps = {
  location: null,
};

const styles = theme => ({
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
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  [theme.breakpoints.down('sm')]: {
    content: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
    },
  },
});

const Footer = withStyles(styles)(FooterCore);

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
