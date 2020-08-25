import React from 'react';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: theme.spacing(4),
    width: '100%',
  },
  button: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.primary.contrastText,
    borderRadius: 0,
    margin: theme.spacing(1),

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
}));

const Filters = props => {
  const { list, activeItem, onClick } = props;
  const classes = useStyles(props);

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

Filters.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeItem: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Filters;
