import React from 'react';
import Keys from './keys';

class Photos extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'photoAlbums' }).then(res => {
			console.log(res);
		});
	}
	
	render() {
		return (
			<div>Photos</div>
		);
	}
}

export default Photos;