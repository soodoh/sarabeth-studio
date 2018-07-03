import React from 'react';
import Keys from './keys';
import Grid from '@material-ui/core/Grid';

class About extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'about' }).then(res => {
			this.setState({
				data: res.items,
				loading: false
			})
		});
	}
	
	render() {
		console.log(this.state.data)
		
		return (
			<Grid container spacing={8}>
				<Grid item xs={4}>
				
				</Grid>
				
				<Grid item xs={8}>
				
				</Grid>
			</Grid>
		);
	}
}

export default About;