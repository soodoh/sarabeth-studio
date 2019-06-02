import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Metadata from '../components/Layout/Metadata';
import Title from '../components/common/Title';
import List from '../components/Engagements/EngagementList';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100vw',
    padding: theme.spacing(4),
  },
  upcoming: {
    paddingBottom: theme.spacing(8),
  },
}));

const Engagements = (props) => {
  const { data } = props;
  const classes = useStyles(props);

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
        description="Young and talented female opera singer, Sarabeth Belon, captivates audiences throughout the country. Learn more about her current and upcoming
engagements!"
        keywords={['sarabeth belon engagements']}
      />

      <div className={classes.container}>
        {upcoming
        && (
          <div className={classes.upcoming}>
            <Title>Upcoming</Title>

            <List data={upcoming} />
          </div>
        )
      }

        <div>
          <Title>Past</Title>

          {past
            ? <List data={past} />
            : (
              <Typography variant="h5" color="inherit" align="center">
                There are current no engagements
              </Typography>
            )
          }
        </div>
      </div>
    </React.Fragment>
  );
};
Engagements.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

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
