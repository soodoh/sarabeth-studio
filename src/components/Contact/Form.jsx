import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const Form = (props) => {
  const {
    classes, onChange, values, validations,
  } = props;

  return (
    <div className={classes.container}>
      <TextField
        fullWidth
        className={`${classes.halfWidth} ${classes.textInput}`}
        margin="normal"
        label="Name"
        value={values.name}
        onChange={onChange('name')}
        error={!!validations.name}
        helperText={validations.name}
      />
      <TextField
        fullWidth
        className={`${classes.halfWidth} ${classes.textInput}`}
        margin="normal"
        label="Email"
        value={values.email}
        onChange={onChange('email')}
        error={!!validations.email}
        helperText={validations.email}
      />
      <TextField
        fullWidth
        className={classes.textInput}
        margin="normal"
        label="Subject"
        value={values.subject}
        onChange={onChange('subject')}
        error={!!validations.subject}
        helperText={validations.subject}
      />
      <TextField
        fullWidth
        className={classes.textInput}
        multiline
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
  classes: PropTypes.shape({}).isRequired,
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

const styles = theme => ({
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
    margin: `${theme.spacing.unit * 2}px 0`,
  },
});

export default withStyles(styles)(Form);
