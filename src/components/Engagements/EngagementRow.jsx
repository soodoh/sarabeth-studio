import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const EngagementCore = (props) => {
  const { classes, data } = props;
  const isUpcoming = Moment(data.endDate).isAfter(Moment());
  const startDate = Moment(data.startDate).format('MMMM Do');
  const endDate = Moment(data.endDate).format('MMMM Do, YYYY');

  return (
    <Grid
      container
      spacing={8}
      className={classes.container}
    >
      <Grid item xs={12} sm={4}>
        <Typography
          className={classes.prefix}
          variant="h6"
          color="inherit"
        >
          Performing as
        </Typography>
        <Typography variant="h5" color="inherit">
          {data.role}
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography variant="h5" color="inherit">
          {data.label}
        </Typography>

        <Typography variant="subtitle1" color="inherit">
          {data.company}
        </Typography>

        <Typography variant="body2" color="inherit">
          {`${startDate} - ${endDate}`}
        </Typography>
      </Grid>

      <Grid item xs={12} sm={2}>
        <Button
          variant="outlined"
          onClick={() => { window.location.href = data.link; }}
        >
          {isUpcoming ? 'Buy Tickets' : 'Learn More'}
        </Button>
      </Grid>
    </Grid>
  );
};

EngagementCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({
    endDate: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};

const styles = theme => ({
  container: {
    color: theme.palette.primary.contrastText,
    margin: theme.spacing.unit * 4,
  },
  prefix: {
    fontStyle: 'italic',
    fontSize: '.8rem',
  },
});

export default withStyles(styles)(EngagementCore);
