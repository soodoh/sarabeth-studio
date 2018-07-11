import React from 'react';
import Keys from './keys';
import Loading from './Loading';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
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
		
		return (
			<div className={classes.container}>
				{this.state.loading &&
					<Loading />
				}
				<Document file={this.state.resume}
				          className={classes.resume}
				          loading={<Loading />}
				>
					<Page pageNumber={1} />
				</Document>
			</div>
		);
	}
}

const styles = theme => ({
	container: {
		width: '100%'
	},
	resume: {
		display: 'flex',
		justifyContent: 'center'
	}
});

export default withStyles(styles)(Resume);