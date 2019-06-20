import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql, Link } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fade from 'react-reveal/Fade';
import Metadata from '../components/Layout/Metadata';
import Background from '../components/Layout/Background';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  callsToAction: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    whiteSpace: 'nowrap',
    margin: theme.spacing(2),
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
}));

const HomePage = (props) => {
  const { data } = props;
  const classes = useStyles(props);
  const transitionDelay = 500;

  return (
    <React.Fragment>
      <Metadata
        title="Sarabeth Belón: Portfolio"
        description="Sarabeth Belon, a young female opera singer, captivates audiences with her tessitura and repertoire versatility. Learn more about this artist!"
        keywords={[
          'young female opera singer',
          'opera singer los angeles',
        ]}
      />
      <Background sizes={data.background.fluid} />

      <div className={classes.container}>
        <Fade top opposite>
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
        </Fade>

        <div className={classes.callsToAction}>
          <Fade left opposite delay={transitionDelay}>
            <Button
              component={Link}
              to="/media"
              className={classes.button}
              variant="outlined"
            >
              Have a Listen!
            </Button>
          </Fade>
          <Fade right opposite delay={transitionDelay * 2}>
            <Button
              component={Link}
              to="/lessons"
              className={classes.button}
              variant="outlined"
            >
              Get Voice Lessons
            </Button>
          </Fade>
        </div>
      </div>
    </React.Fragment>

  );
};

HomePage.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

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
