import React from 'react';
import Keys from './keys';

class Audio extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'audio' }).then(res => {
			console.log(res);
		});
	}
	
	render() {
		return (
			<div>Audio</div>
		);
	}
}

export default Audio;