import React, { ReactElement } from 'react';
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

interface FiltersProps {
  list: string[];
  activeItem: string;
  onClick: (item: string) => void;
}

const Filters = (props: FiltersProps): ReactElement => {
  const { list, activeItem, onClick } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.buttonGroup}>
      {list.map(item => (
        <Button
          key={item}
          variant="contained"
          className={`${classes.button} ${activeItem === item ? classes.active : ''}`}
          onClick={() => onClick(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
};

export default Filters;
