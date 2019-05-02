import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Metadata from '../components/Layout/Metadata';
import Title from '../components/common/Title';
import List from '../components/Engagements/EngagementList';

const EngagementsCore = (props) => {
  const { classes, data } = props;

  const upcoming = data.filter(engagement => (
    Moment(engagement.endDate).isAfter(Moment())
  )).reverse();
  const past = data.filter(engagement => (
    Moment(engagement.endDate).isBefore(Moment())
  ));

  return (
    <React.Fragment>
      <Metadata
        title="Sarabeth's Engagements"
        description="View past and upcoming engagements where Sarabeth Belón will be performing. Location, venue, dates and the link to buy tickets is listed for each event."
        keywords={['sarabeth belon engagements']}
      />

      <Grid container spacing={8} className={classes.container}>
        {upcoming
        && (
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Title>Upcoming</Title>
          </Grid>
          <Grid item xs={12}>
            <List data={upcoming} />
          </Grid>
        </Grid>
        )
      }

        <Grid item xs={12}>
          <Title>Past</Title>
        </Grid>
        <Grid item xs={12}>
          {past
            ? <List data={past} />
            : (
              <Typography variant="h5" color="inherit" align="center">
              There are currently no engagements
              </Typography>
            )
        }
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
EngagementsCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

const styles = theme => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit * 4,
  },
});

const Engagements = withStyles(styles)(EngagementsCore);

export default () => (
  <StaticQuery
    query={graphql`
      query EngagementQuery {
        allContentfulEngagements(sort: {fields: [endDate], order: DESC}) {
          edges {
            node {
              endDate
              startDate
              role
              label
              company
              link
            }
          }
        }
      }
    `}
    render={data => (
      <Engagements
        data={data.allContentfulEngagements.edges.map(item => (
          item.node
        ))}
      />
    )}
  />
);
