import React from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from '../Title';
import Form from './Form';
import Message from './Message';
import Keys from "../keys";
import Validator from 'email-validator';

class ContactCore extends React.Component {
	constructor(props) {
		super(props);

		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);

		this.state = {
			name: '',
			email: '',
			subject: '',
			message: '',
			validations: {},
			submitUrl: '',
			messageOpen: false,
			submitSuccess: false,
			loading: true,
		};
		this.handleChange = this.handleChange.bind(this);
		this.messageClose = this.messageClose.bind(this);
		this.validate = this.validate.bind(this);
		this.submit = this.submit.bind(this);
	}

	componentDidMount() {
		this.client.getEntries({ content_type: 'contact' }).then((res) => {
			this.setState({
				loading: false,
				submitUrl: res.items[0].fields.awsUrl,
			});
		});
	}

	validate(key, newValue) {
    const { name, email, subject, message, validations } = this.state;
    const newValidations = { ...validations };

		if(!key) {
      // If not specified, run all validations
			newValidations.name = !name && 'Required Field';
			newValidations.email = !Validator.validate(email) && 'Enter a valid Email';
			newValidations.subject = !subject && 'Required Field';
			newValidations.message = !message && 'Required Field';
		} else if(key === 'email') {
			newValidations.email = !Validator.validate(newValue) && 'Enter a valid Email';
		} else {
			newValidations[key] = !newValue && 'Required Field';
		}

		return newValidations;
	}

	submit() {
    const validations = this.validate();
    const { name, email, subject, message, submitUrl } = this.state;

		if(validations.name || validations.email || validations.subject || validations.message) {
			this.setState({ validations });
			return;
		}
		this.setState({ loading: true });

		const data = {
			name: name,
			email: email,
			subject: subject,
			message: message,
		};
		axios.post(submitUrl, JSON.stringify(data)).then((res) => {
			this.setState({
				loading: false,
				submitSuccess: res.status === 200,
				messageOpen: true,
				name: '',
				email: '',
				subject: '',
				message: '',
			});
		}).catch((err) => {
			console.error(err);
			this.setState({
				loading: false,
				submitSuccess: false,
				messageOpen: true,
			});
		});
	}

	handleChange(key) {
		return (event) => {
			this.setState({
				[key]: event.target.value,
				validations: this.validate(key, event.target.value),
			});
		};
	}

	messageClose(event, reason) {
		if (reason === 'clickaway') return;

		this.setState({ messageOpen: false });
	}

	render() {
    const { classes } = this.props;
    const {
      name, email, subject, message, validations,
      loading, messageOpen, submitSuccess,
    } = this.state;

		const values = { name, email, subject, message };

		return (
			<Grid container spacing={8} className={classes.container}>
				<Grid item xs={12}>
					<Title>Contact Sarabeth</Title>
				</Grid>

				<Form
          values={values}
          validations={validations}
          onChange={this.handleChange}
				/>

				<Grid item xs={12}>
					{loading ?
						<CircularProgress color="secondary" className={classes.loading} /> :
            <Button
              variant="outlined"
              className={classes.button}
              onClick={this.submit}
						>
							Submit
						</Button>
					}
				</Grid>

				<Message
          open={messageOpen}
          onClose={this.messageClose}
          success={submitSuccess}
				/>
			</Grid>
		);
	}
}

const styles = theme => ({
	container: {
		width: '100%',
		padding: theme.spacing.unit * 4,
	},
	button: {
		marginTop: theme.spacing.unit * 2,
	},
	loading: {
		margin: theme.spacing.unit * 4,
	},
});

export default withStyles(styles)(ContactCore);
