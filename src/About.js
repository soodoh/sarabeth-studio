import React from 'react';
import Keys from './keys';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
				data: res.items[0],
				loading: false
			})
		});
	}
	
	render() {
		console.log(this.state.data)
		const { classes } = this.props;
		
		if(this.state.loading)
			return <div>Loading</div>;
		
		return (
			<Grid container spacing={16} className={classes.container}>
				<Grid item xs={12} sm={6} md={4}>
					<img src={this.state.data.fields.headshot.fields.file.url}
					     className={classes.headshot}
					/>
				</Grid>
				
				<Grid item xs={12} sm={6} md={8} className={classes.bio}>
					<Typography variant='display3' color='secondary' gutterBottom>
						{this.state.data.fields.title}
					</Typography>
					
					<Typography variant='body1' color='inherit'>
						{this.state.data.fields.bio}
					</Typography>
				</Grid>
			</Grid>
		);
	}
}

const styles = theme => ({
	container: {
		color: theme.palette.primary.contrastText,
		padding: theme.spacing.unit * 2
	},
	headshot: {
		width: '100%'
	},
	bio: {
		paddingLeft: theme.spacing.unit * 2
	}
});

export default withStyles(styles)(About);