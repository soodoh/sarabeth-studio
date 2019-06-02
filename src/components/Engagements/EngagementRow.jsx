import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.primary.contrastText,
    margin: theme.spacing(4),

    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  role: {},
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,

    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2, 0),
    },
  },
  prefix: {
    fontStyle: 'italic',
    fontSize: '.8rem',
  },
}));

const Engagement = (props) => {
  const { data } = props;
  const classes = useStyles(props);
  const isUpcoming = moment(data.endDate).isAfter(moment());
  const startDate = moment(data.startDate).format('MMMM Do');
  const endDate = moment(data.endDate).format('MMMM Do, YYYY');

  return (
    <div className={classes.container}>
      <div className={classes.role}>
        <Typography className={classes.prefix} variant="h6" color="inherit">
          Performing as
        </Typography>
        <Typography variant="h5" color="inherit">
          {data.role}
        </Typography>
      </div>

      <div className={classes.info}>
        <Typography variant="h5" color="inherit">
          {data.label}
        </Typography>

        <Typography variant="subtitle1" color="inherit">
          {data.company}
        </Typography>

        <Typography variant="body2" color="inherit">
          {`${startDate} - ${endDate}`}
        </Typography>
      </div>

      <div>
        <Button
          variant="outlined"
          onClick={() => {
            window.location.href = data.link;
          }}
        >
          {isUpcoming ? 'Buy Tickets' : 'Learn More'}
        </Button>
      </div>
    </div>
  );
};

Engagement.propTypes = {
  data: PropTypes.shape({
    endDate: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};

export default Engagement;
