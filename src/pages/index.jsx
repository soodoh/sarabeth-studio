import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql, Link } from 'gatsby';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
        keywords={[
          'young female opera singer',
          'opera singer los angeles',
          'vocal coach los angeles',
          'piano lessons los angeles',
        ]}
      />
      <Background sizes={data.background.fluid} />

      <div className={classes.container}>
        <Typography
          variant="h1"
          align="center"
          className={classes.title}
          gutterBottom
        >
          {data.title}
        </Typography>
        <Typography
          variant="h3"
          align="center"
          className={classes.subtitle}
          gutterBottom
        >
          {data.subtitle}
        </Typography>

        <div className={classes.callsToAction}>
          <Button
            component={Link}
            to="/media"
            className={classes.button}
            variant="outlined"
          >
            Have a Listen!
          </Button>
          <Button
            component={Link}
            to="/lessons"
            className={classes.button}
            variant="outlined"
          >
            Get Voice Lessons
          </Button>
        </div>
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
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.unit * 3,
  },
  callsToAction: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    whiteSpace: 'nowrap',
    margin: theme.spacing.unit * 2,
    borderColor: theme.palette.secondary.light,
    backgroundColor: theme.palette.secondary.light,
    color: 'black',
    '&:hover': {
      color: theme.palette.secondary.light,
    },
  },
  title: {
    marginTop: '30vh',
    color: theme.palette.primary.contrastText,
    fontFamily: theme.typography.h3.fontFamily,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '2rem',
    color: theme.palette.primary.contrastText,
    fontFamily: theme.typography.h3.fontFamily,
  },
});

const HomePage = withStyles(styles)(HomePageCore);

export default () => (
  <StaticQuery
    query={graphql`
      query HomePageQuery {
        contentfulHomePage {
          title,
          subtitle,
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
