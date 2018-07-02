import React from 'react';
import Keys from './keys';

class About extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}
	
	render() {
		return (
			<div>About</div>
		);
	}
}

export default About;