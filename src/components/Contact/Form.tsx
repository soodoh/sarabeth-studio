import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Fade from 'react-reveal/Fade';

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

interface FormProps {
  onChange: (key: string) => () => void;
  values: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  validations: any;
}

const Form = (props: FormProps): ReactElement => {
  const { onChange, values, validations } = props;
  const classes = useStyles(props);
  const outlineClasses = { notchedOutline: classes.notchedOutline };
  const transitionDelay = 200;
  const inputs = [
    { label: 'Name', key: 'name', halfWidth: true },
    { label: 'Email', key: 'email', halfWidth: true },
    { label: 'Subject', key: 'subject' },
    { label: 'Message', key: 'message', rows: 5 },
  ];

  return (
    <div className={classes.container}>
      {inputs.map(({ label, key, halfWidth, rows }, index) => (
        <Fade key={label} opposite delay={transitionDelay * (index + 1)}>
          <TextField
            fullWidth
            variant="outlined"
            className={`${halfWidth && classes.halfWidth} ${classes.textInput}`}
            InputProps={{ classes: outlineClasses }}
            margin="normal"
            label={label}
            value={values[key]}
            onChange={onChange(key)}
            error={!!validations[key]}
            helperText={validations[key]}
            rows={rows}
            multiline={!!rows}
          />
        </Fade>
      ))}
    </div>
  );
};

export default Form;
