import React from 'react';
import Title from '../Title';
import Form from './Form';
import Message from './Message';
import Keys from "../keys";
import Validator from 'email-validator';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

class Contact extends React.Component {
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
			loading: true
		};
		this.handleChange = this.handleChange.bind(this);
		this.messageClose = this.messageClose.bind(this);
		this.validate = this.validate.bind(this);
		this.submit = this.submit.bind(this);
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'contact' }).then(res => {
			this.setState({
				loading: false,
				submitUrl: res.items[0].fields.awsUrl
			});
		});
	}
	
	validate(key, newValue) {
		let validations = {};
		if(!key) {
			validations = {
				name: !this.state.name && 'Required Field',
				email: !Validator.validate(this.state.email) && 'Enter a valid Email',
				subject: !this.state.subject && 'Required Field',
				message: !this.state.message && 'Required Field'
			};
		} else if(key === 'email') {
			validations.email = !Validator.validate(newValue) && 'Enter a valid Email';
		} else {
			validations[key] = !newValue && 'Required Field';
		}
		
		return validations;
	}
	
	submit() {
		const { name, email, subject, message } = this.validate();
		if(name || email || subject || message) {
			this.setState({
				validations: { name, email, subject, message }
			});
			return;
		}
		
		this.setState({ loading: true });
		
		const data = {
			name: this.state.name,
			email: this.state.email,
			subject: this.state.subject,
			message: this.state.message
		};
		axios.post(this.state.submitUrl, JSON.stringify(data)).then(res => {
			console.log(res)
			this.setState({
				loading: false,
				submitSuccess: res.status === 200,
				messageOpen: true,
				name: '',
				email: '',
				subject: '',
				message: ''
			});
		}).catch(err => {
			console.error(err);
			this.setState({
				loading: false,
				submitSuccess: false,
				messageOpen: true
			});
		});
	}
	
	handleChange(key) {
		return (event) => {
			this.setState({
				[key]: event.target.value,
				validations: {...this.state.validations, ...this.validate(key, event.target.value)}
			});
		};
	}
	
	messageClose(event, reason) {
		if(reason === 'clickaway')
			return;
		
		this.setState({ messageOpen: false });
	}
	
	render() {
		const { classes } = this.props;
		const values = {
			name: this.state.name,
			email: this.state.email,
			subject: this.state.subject,
			message: this.state.message
		};
		
		return (
			<Grid container spacing={8} className={classes.container}>
				<Grid item xs={12}>
					<Title>Contact Sarabeth</Title>
				</Grid>
				
				<Form values={values}
				      validations={this.state.validations}
				      onChange={this.handleChange}
				/>
				
				<Grid item xs={12}>
					{this.state.loading ?
						<CircularProgress color='secondary' className={classes.loading} /> :
						<Button variant='outlined'
						        className={classes.button}
						        onClick={this.submit}
						>
							Submit
						</Button>
					}
				</Grid>
				
				<Message open={this.state.messageOpen}
				         onClose={this.messageClose}
				         success={this.state.submitSuccess}
				/>
			</Grid>
		);
	}
}

const styles = theme => ({
	container: {
		width: '100%',
		padding: theme.spacing.unit * 4
	},
	button: {
		marginTop: theme.spacing.unit * 2
	},
	loading: {
		margin: theme.spacing.unit * 4
	}
});

export default withStyles(styles)(Contact);