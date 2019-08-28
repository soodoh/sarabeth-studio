import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Fade from 'react-reveal/Fade';
import Metadata from '../components/Layout/Metadata';
import Title from '../components/common/Title';
import List from '../components/Engagements/EngagementList';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(4),
  },
  upcoming: {
    paddingBottom: theme.spacing(8),
  },
}));

const Engagements = (props) => {
  const { data } = props;
  const classes = useStyles(props);

  const upcoming = data.filter((engagement) => (
    moment(engagement.endDate).isAfter(moment())
  )).reverse();
  const past = data.filter((engagement) => (
    moment(engagement.endDate).isBefore(moment())
  ));

  return (
    <>
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
            <Fade top opposite>
              <Title>Upcoming</Title>
            </Fade>

            <List data={upcoming} />
          </div>
        )}

        <div>
          <Fade top opposite delay={500}>
            <Title>Past</Title>
          </Fade>

          {past
            ? <List data={past} />
            : (
              <Typography variant="h5" color="inherit" align="center">
                There are current no engagements
              </Typography>
            )}
        </div>
      </div>
    </>
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
    render={(data) => (
      <Engagements
        data={data.allContentfulEngagements.edges.map((item) => (
          item.node
        ))}
      />
    )}
  />
);
