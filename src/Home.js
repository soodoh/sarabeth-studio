import React from 'react';
import Keys from './keys';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class Home extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'home' }).then(res => {
			const data = res.items[0];
			this.setState({
				loading: false,
				data
			});
			
			// Set background image
			const bodyStyle = document.body.style;
			bodyStyle.backgroundSize = 'cover';
			bodyStyle.backgroundPosition = 'top';
			bodyStyle.backgroundAttachment = 'fixed';
			bodyStyle.backgroundImage = `url(${data.fields.background.fields.file.url})`;
		});
	}
	
	componentWillUnmount() {
		// Remove background image
		document.body.style.backgroundImage = ``;
	}
	
	render() {
		const { classes } = this.props;
		
		if(this.state.loading)
			return <div>Loading</div>;
			
		return (
			<div className={classes.container}>
				<Typography variant='display3'
				            color='secondary'
				            align='center'
				            gutterBottom
				>
					{this.state.data.fields.title}
				</Typography>
				
				<Typography variant='display1'
				            color='secondary'
				            align='center'
				            gutterBottom
				>
					{this.state.data.fields.subtitle}
				</Typography>
				
				<Link to='/audio' style={{ textDecoration: 'none' }}>
					<Button variant='outlined' className={classes.button}>
						{this.state.data.fields.buttonLabel}
					</Button>
				</Link>
			</div>
		);
	}
}

const styles = theme => ({
	container: {
		display: 'flex',
		paddingTop: '30vh',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	button: {
		marginTop: theme.spacing.unit * 7,
		textTransform: 'none',
		fontSize: '1.2rem',
		color: theme.palette.primary.contrastText,
		border: `1px solid ${theme.palette.primary.contrastText}`,
		borderRadius: 0
	}
});

export default withStyles(styles)(Home);