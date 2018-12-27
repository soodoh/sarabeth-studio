import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const TitleCore = (props) => {
  const { classes, children } = props;

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        {children}
      </Typography>
    </div>
  );
};
TitleCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  children: PropTypes.string.isRequired,
};

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    display: 'inline-block',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
  },
});

export default withStyles(styles)(TitleCore);
