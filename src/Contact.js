import React from 'react';
import Title from './Title';
import Keys from "./keys";
import Validator from 'email-validator';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
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
			loading: true
		};
		this.handleChange = this.handleChange.bind(this);
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
		
	}
	
	handleChange(key) {
		return (event) => {
			this.setState({
				[key]: event.target.value,
				validations: {...this.state.validations, ...this.validate(key, event.target.value)}
			});
		};
	}
	
	render() {
		const { classes } = this.props;
		return (
			<Grid container spacing={8} className={classes.container}>
				<Grid item xs={12}>
					<Title>Contact Sarabeth</Title>
				</Grid>
				
				<Grid item xs={12}>
					<Grid item xs={12} sm={6}>
						<TextField fullWidth
						           margin='normal'
						           label='Name'
						           value={this.state.name}
						           onChange={this.handleChange('name')}
						           error={!!this.state.validations.name}
						           helperText={this.state.validations.name}
						/>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid item xs={12} sm={6}>
						<TextField fullWidth
						           margin='normal'
						           label='Email'
						           value={this.state.email}
						           onChange={this.handleChange('email')}
						           error={!!this.state.validations.email}
						           helperText={this.state.validations.email}
						/>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<TextField fullWidth
					           margin='normal'
					           label='Subject'
					           value={this.state.subject}
					           onChange={this.handleChange('subject')}
					           error={!!this.state.validations.subject}
					           helperText={this.state.validations.subject}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField fullWidth
					           multiline
					           margin='normal'
					           label='Message'
					           value={this.state.message}
					           onChange={this.handleChange('message')}
					           error={!!this.state.validations.message}
					           helperText={this.state.validations.message}
					/>
				</Grid>
				
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