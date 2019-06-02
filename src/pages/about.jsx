import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Metadata from '../components/Layout/Metadata';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '33% 1fr',
    gridTemplateRows: 'auto auto',
    gridColumnGap: theme.spacing(4),
    padding: `${theme.spacing(2)}px 10vw`,
    width: '100%',

    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
      gridTemplateColumns: '50% 1fr',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
    },
  },
  portrait: {
    maxWidth: theme.spacing(50),
    margin: 'auto',
    marginBottom: theme.spacing(4),
  },
  title: {
    textTransform: 'uppercase',
  },
  bodyText: {
    ...theme.typography.body1,
    fontSize: '1.2rem',

    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(2),
    },
  },
}));

export const About = (props) => {
  const { data } = props;
  const classes = useStyles(props);
  const bioHtml = data.bio.childMarkdownRemark.html;

  return (
    <React.Fragment>
      <Metadata
        title="About Sarabeth"
        description="Offering the very best private vocal lessons in Los Angeles. Refine your voice, achieve constant flow of breadth, and sing with ease."
        keywords={['vocal lessons los angeles', 'piano teacher los angeles']}
      />

      <div className={classes.container}>
        <div>
          <Img
            className={classes.portrait}
            fluid={data.headshot.fluid}
            title="Sarabeth Portrait"
            alt="Sarabeth Belón Headshot"
          />
        </div>

        <div>
          <Typography
            variant="h1"
            color="secondary"
            className={classes.title}
            gutterBottom
          >
            {data.title}
          </Typography>

          <div
            className={classes.bodyText}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: bioHtml }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
About.propTypes = {
  data: PropTypes.shape({
    bio: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    headshot: PropTypes.object.isRequired,
  }).isRequired,
};

export default () => (
  <StaticQuery
    query={graphql`
      query AboutQuery {
        contentfulAbout {
          title
          headshot {
            fluid(maxWidth: 1280) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          bio {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    `}
    render={data => <About data={data.contentfulAbout} />}
  />
);
