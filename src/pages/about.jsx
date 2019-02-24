import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Metadata from '../components/Layout/Metadata';

export const AboutCore = (props) => {
  const { classes, data } = props;
  const bioHtml = data.bio.childMarkdownRemark.html;

  return (
    <React.Fragment>
      <Metadata
        title="About Sarabeth"
        description="Sarabeth Belón is a San Diego native and UCLA alumnus . Based in LA County, she is available for hire as a professional singer and voice & piano teacher."
      />

      <Grid container spacing={16} className={classes.container}>
        <Grid item xs={12} sm={6} md={4}>
          <Img
            fluid={data.headshot.fluid}
            title="Sarabeth Portrait"
            alt="Sarabeth Belón Headshot"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={8} className={classes.bio}>
          <Typography variant="h1" color="secondary" gutterBottom>
            {data.title}
          </Typography>

          <div
            className={classes.bodyText}
          // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: bioHtml }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
AboutCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({
    bio: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    headshot: PropTypes.object.isRequired,
  }).isRequired,
};

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 2,
    width: '100%',
  },
  bio: {
    paddingLeft: theme.spacing.unit * 2,
  },
  bodyText: {
    ...theme.typography.body1,
    fontSize: '1.2rem',
  },
});

const About = withStyles(styles)(AboutCore);

export default () => (
  <StaticQuery
    query={graphql`
      query AboutQuery {
        contentfulAbout {
          title,
          headshot{
            fluid(maxWidth:1280){
              ...GatsbyContentfulFluid_withWebp
            },
          },
          bio {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    `}
    render={data => (
      <About data={data.contentfulAbout} />
    )}
  />
);
