import React from 'react';
import Keys from './keys';
import Loading from './Loading';
import { withStyles } from '@material-ui/core/styles';

class Resume extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'about' }).then(res => {
			this.setState({
				resume: res.items[0].fields.resume.fields.file.url,
				loading: false
			});
		});
	}
	
	render() {
		const { classes } = this.props;
		
		if(this.state.loading)
			return <Loading />;
		
		return (
			<object data={this.state.resume}
			        type='application/pdf'
			        className={classes.resume}
			>
				<a href={this.state.resume}>Sarabeth_Resume.pdf</a>
			</object>
		);
	}
}

const styles = theme => ({
	resume: {
		width: '100%',
		height: `calc(100vh - ${theme.spacing.unit * 20}px)`
	}
});

export default withStyles(styles)(Resume);