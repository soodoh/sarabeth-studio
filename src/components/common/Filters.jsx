import React from 'react';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const FiltersCore = (props) => {
  const {
    classes, list, activeItem, onClick,
  } = props;

  return (
    <div className={classes.buttonGroup}>
      {list.map(item => (
        <Button
          key={uid(item)}
          variant="contained"
          className={classNames(classes.button, { [classes.active]: activeItem === item })}
          onClick={() => onClick(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
};
FiltersCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  list: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  activeItem: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const styles = theme => ({
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit * 4,
    width: '100%',
  },
  button: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.primary.contrastText,
    borderRadius: 0,
    margin: theme.spacing.unit,

    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  active: {
    backgroundColor: theme.palette.primary.main,

    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
});

export default withStyles(styles)(FiltersCore);
