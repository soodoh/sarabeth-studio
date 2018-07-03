import React from 'react';
import Keys from './keys';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
			this.setState({
				loading: false
			});
		});
	}
	
	render() {
		const { classes } = this.props;
		
		if(this.state.loading)
			return <div>Loading</div>;
			
		return (
			<Grid container spacing={8} className={classes.container}>
				<Grid item xs={12}>
					<Typography variant='display1' align='center'>
						<span className={classes.title}>Photos</span>
					</Typography>
				</Grid>
			</Grid>
		);
	}
}

const styles = theme => ({
	container: {
		margin: theme.spacing.unit * 4
	},
	title: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText,
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`
	}
});

export default withStyles(styles)(Photos);