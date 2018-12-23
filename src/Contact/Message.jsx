import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import green from "@material-ui/core/colors/green";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from 'mdi-material-ui/Close';
import ErrorIcon from 'mdi-material-ui/AlertCircle';
import SuccessIcon from 'mdi-material-ui/CheckCircle';
import IconButton from '@material-ui/core/IconButton';

const MessageCore = props => {
	const { classes, open, onClose, success } = props;

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
				className={classNames(classes.container, { [classes.success]: success, [classes.error]: !success })}
				aria-describedby={`${success ? 'success' : 'error'}-message`}
				message={
					success ?
						<span id="success-message" className={classes.message}>
							<SuccessIcon className={classes.icon} />
							Email Submitted
						</span> :
						<span id='error-message' className={classes.message}>
							<ErrorIcon className={classes.icon}/>
							Email Failed
						</span>
				}
				action={[
					<IconButton
						key="close"
						aria-label="Close"
						color="inherit"
						onClick={onClose}
					>
						<CloseIcon />
					</IconButton>
				]}
			/>
		</Snackbar>
	);
};

const styles = theme => ({
	message: {
		display: 'flex',
		alignItems: 'center',
	},
	icon: {
		marginRight: theme.spacing.unit,
	},
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
});

export default withStyles(styles)(MessageCore);
