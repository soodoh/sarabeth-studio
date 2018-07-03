import React from 'react';
import Keys from "./keys";

class SocialMedia extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'socialMedia' }).then(res => {
			// console.log(res);
		});
	}
	
	render() {
		return (
			<div>Social Media Buttons</div>
		);
	}
}

export default SocialMedia;