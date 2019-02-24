import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Metadata from '../components/Layout/Metadata';
import Background from '../components/Layout/Background';

const HomePageCore = (props) => {
  const { classes, data } = props;

  return (
    <React.Fragment>
      <Metadata
        title="Sarabeth Belón: Portfolio"
        description="Sarabeth Belón: Opera Singer in Los Angeles. See upcoming engagements, recordings, photos and contact for future gigs or for private voice & piano lessons."
      />
      <Background sizes={data.background.fluid} />

      <div className={classes.container}>
        <Typography
          className={classes.title}
          gutterBottom
        >
          {data.title}
        </Typography>
      </div>
    </React.Fragment>

  );
};

HomePageCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({}).isRequired,
};

const styles = theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    padding: theme.spacing.unit * 3,
  },
  title: {
    marginTop: theme.spacing.unit * -2,
    color: theme.palette.primary.contrastText,
    fontSize: '1.5rem',
    fontFamily: theme.typography.h3.fontFamily,
    fontStyle: 'italic',
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
              ...GatsbyContentfulFluid_withWebp
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
