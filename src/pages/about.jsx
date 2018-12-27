import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const AboutCore = (props) => {
  const { classes, data } = props;
  const bioHtml = data.bio.childMarkdownRemark.html;

  return (
    <Grid container spacing={16} className={classes.container}>
      <Grid item xs={12} sm={6} md={4}>
        <Img sizes={data.headshot.fluid} />
      </Grid>

      <Grid item xs={12} sm={6} md={8} className={classes.bio}>
        <Typography variant="h2" color="secondary" gutterBottom>
          {data.title}
        </Typography>

        <div
          className={classes.bodyText}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: bioHtml }}
        />
      </Grid>
    </Grid>
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
    color: theme.palette.primary.contrastText,
    padding: theme.spacing.unit * 2,
    width: '100%',
  },
  headshot: {
    width: '100%',
    maxWidth: '400px',
  },
  bio: {
    paddingLeft: theme.spacing.unit * 2,
  },
  bodyText: {
    ...theme.typography.body1,
    color: theme.palette.primary.contrastText,
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
