import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/styles';
import green from '@material-ui/core/colors/green';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from 'mdi-material-ui/Close';
import ErrorIcon from 'mdi-material-ui/AlertCircle';
import SuccessIcon from 'mdi-material-ui/CheckCircle';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}));

interface MessageProps {
  open: boolean;
  onClose: () => void;
  success: boolean;
}

const Message = (props: MessageProps): ReactElement => {
  const { open, onClose, success } = props;
  const classes = useStyles(props);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <SnackbarContent
        className={success ? classes.success : classes.error}
        aria-describedby={`${success ? 'success' : 'error'}-message`}
        message={
          success ? (
            <span id="success-message" className={classes.message}>
              <SuccessIcon className={classes.icon} />
              Email Submitted
            </span>
          ) : (
            <span id="error-message" className={classes.message}>
              <ErrorIcon className={classes.icon} />
              Email Failed
            </span>
          )
        }
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default Message;
