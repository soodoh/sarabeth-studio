import React from 'react';
import Keys from './keys';

class Engagements extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'engagements' }).then(res => {
			console.log(res);
		});
	}
	
	render() {
		return (
			<div>Engagements</div>
		);
	}
}

export default Engagements;