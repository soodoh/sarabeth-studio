import React from 'react';
import Keys from './keys';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Instagram from 'mdi-material-ui/Instagram';
import Facebook from 'mdi-material-ui/Facebook';
import Soundcloud from 'mdi-material-ui/Soundcloud';
import Youtube from 'mdi-material-ui/Youtube';
import Linkedin from 'mdi-material-ui/Linkedin';
import Twitter from 'mdi-material-ui/Twitter';
import Email from 'mdi-material-ui/Email';

function renderIcon(icon) {
	switch(icon) {
		case 'Email':
			return <Email />;
		case 'Instagram':
			return <Instagram />;
		case 'Facebook':
			return <Facebook />;
		case 'Soundcloud':
			return <Soundcloud />;
		case 'Youtube':
			return <Youtube />;
		case 'Linkedin':
			return <Linkedin />;
		case 'Twitter':
			return <Twitter />;
		default:
			return <div></div>;
	}
}

const ButtonBase = props => (
	<a href={props.icon === 'Email' ? `mailto:${props.url}` : props.url} style={{ color: 'inherit' }}>
		<Fab size="small" className={props.classes.button}>
			{renderIcon(props.icon)}
		</Fab>
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

		return (
			<div className={classes.container}>
				{this.state.icons.map((icon, index) => (
          <SocialMediaButton
            key={index}
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
		justifyContent: 'center',
		flexWrap: 'wrap'
	}
};

export default withStyles(styles)(SocialMedia);