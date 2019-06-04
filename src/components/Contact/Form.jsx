import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  halfWidth: {
    width: '50%',

    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  textInput: {
    margin: theme.spacing(2, 0),
  },
  notchedOutline: {
    borderColor: `${theme.palette.primary.contrastText}!important`,
  },
}));

const Form = (props) => {
  const {
    onChange, values, validations,
  } = props;
  const classes = useStyles(props);
  const outlineClasses = { notchedOutline: classes.notchedOutline };

  return (
    <div className={classes.container}>
      <TextField
        fullWidth
        variant="outlined"
        className={`${classes.halfWidth} ${classes.textInput}`}
        InputProps={{ classes: outlineClasses }}
        margin="normal"
        label="Name"
        value={values.name}
        onChange={onChange('name')}
        error={!!validations.name}
        helperText={validations.name}
      />
      <TextField
        fullWidth
        variant="outlined"
        className={`${classes.halfWidth} ${classes.textInput}`}
        InputProps={{ classes: outlineClasses }}
        margin="normal"
        label="Email"
        value={values.email}
        onChange={onChange('email')}
        error={!!validations.email}
        helperText={validations.email}
      />
      <TextField
        fullWidth
        variant="outlined"
        className={classes.textInput}
        InputProps={{ classes: outlineClasses }}
        margin="normal"
        label="Subject"
        value={values.subject}
        onChange={onChange('subject')}
        error={!!validations.subject}
        helperText={validations.subject}
      />
      <TextField
        fullWidth
        variant="outlined"
        className={classes.textInput}
        InputProps={{ classes: outlineClasses }}
        multiline
        rows={5}
        margin="normal"
        label="Message"
        value={values.message}
        onChange={onChange('message')}
        error={!!validations.message}
        helperText={validations.message}
      />
    </div>
  );
};

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  values: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    subject: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  validations: PropTypes.shape({
    name: PropTypes.oneOf([false, 'Required Field']),
    email: PropTypes.oneOf([false, 'Enter a valid Email']),
    subject: PropTypes.oneOf([false, 'Required Field']),
    message: PropTypes.oneOf([false, 'Required Field']),
  }).isRequired,
};

export default Form;
