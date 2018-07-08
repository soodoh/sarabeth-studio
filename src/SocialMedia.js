import React from 'react';
import Keys from './keys';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Instagram from 'mdi-material-ui/Instagram';
import Facebook from 'mdi-material-ui/Facebook';
import Soundcloud from 'mdi-material-ui/Soundcloud';
import Youtube from 'mdi-material-ui/Youtube';
import Linkedin from 'mdi-material-ui/Linkedin';
import Twitter from 'mdi-material-ui/Twitter';

function renderIcon(icon) {
	switch(icon) {
		case 'instagram':
			return <Instagram />;
		case 'facebook':
			return <Facebook />;
		case 'soundcloud':
			return <Soundcloud />;
		case 'youtube':
			return <Youtube />;
		case 'linkedin':
			return <Linkedin />;
		case 'twitter':
			return <Twitter />;
		default:
			return <div></div>;
	}
}

const ButtonBase = props => (
	<a href={props.url} style={{ color: 'inherit' }}>
		<Button variant='fab' mini className={props.classes.button}>
			{renderIcon(props.icon)}
		</Button>
	</a>
);

const buttonStyles = theme => ({
	button: {
		margin: theme.spacing.unit
	}
});
const SocialMediaButton = withStyles(buttonStyles)(ButtonBase);

class SocialMedia extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		
		this.state = { icons: [] };
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'socialMedia', order: 'fields.order' }).then(res => {
			this.setState({
				icons: res.items
			});
		});
	}
	
	render() {
		const { classes } = this.props;
		
		console.log(this.state.icons)
		return (
			<div className={classes.container}>
				{this.state.icons.map((icon, index) => (
					<SocialMediaButton key={index}
					                   url={icon.fields.link}
					                   icon={icon.fields.source}
					/>
				))}
			</div>
		);
	}
}

const styles = {
	container: {
		display: 'flex',
		justifyContent: 'center'
	}
};

export default withStyles(styles)(SocialMedia);