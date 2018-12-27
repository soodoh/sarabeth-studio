import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Background = (props) => {
  const { url } = props;

  return (
    <div style={{
      backgroundImage: `url("${url}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundAttachment: 'fixed',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    }}
    />
  );
};
Background.propTypes = {
  url: PropTypes.string.isRequired,
};

const HomePageCore = (props) => {
  const { classes, data } = props;

  return (
    <div className={classes.container}>
      <Background url={data.background.fluid.srcWebp} />

      <Typography
        variant="h4"
        className={classes.title}
        gutterBottom
      >
        {data.title}
      </Typography>
    </div>
  );
};

HomePageCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({}).isRequired,
};

const styles = theme => ({
  container: {
    display: 'flex',
    padding: theme.spacing.unit * 3,
  },
  title: {
    marginTop: -theme.spacing.unit * 2,
    color: theme.palette.primary.contrastText,
    fontSize: '1.5rem',
  },
});

const HomePage = withStyles(styles)(HomePageCore);

export default () => (
  <StaticQuery
    query={graphql`
      query HomePageQuery {
        contentfulHomePage {
          title,
          background {
            fluid(maxWidth:1920) {
              src,
              sizes,
              srcWebp,
              srcSet,
              srcSetWebp
            }
          },
        }
      }
    `}
    render={data => (
      <HomePage data={data.contentfulHomePage} />
    )}
  />
);
