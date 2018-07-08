import React from 'react';
import Keys from '../keys';
import Loading from '../Loading';
import Title from '../Title';
import List from './List';
import Moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class Index extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.getUpcoming = this.getUpcoming.bind(this);
		this.getPast = this.getPast.bind(this);
		
		this.state = {
			engagements: [],
			loading: true
		};
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'engagements' }).then(res => {
			this.setState({
				loading: false,
				engagements: res.items
			});
		});
	}
	
	getUpcoming() {
		return this.state.engagements.filter(engagement => {
			return Moment(engagement.fields.endDate).isAfter(Moment());
		});
	}
	
	getPast() {
		return this.state.engagements.filter(engagement => {
			return Moment(engagement.fields.endDate).isBefore(Moment());
		});
	}
	
	render() {
		const { classes } = this.props;
		
		if(this.state.loading)
			return <Loading />;
		
		return (
			<Grid container spacing={8} className={classes.container}>
				<Grid item xs={12}>
					<Title>Upcoming</Title>
				</Grid>
				<Grid item xs={12}>
					<List data={this.getUpcoming()} />
				</Grid>
				
				<Grid item xs={12}>
					<Title>Past</Title>
				</Grid>
				<Grid item xs={12}>
					<List data={this.getPast()} />
				</Grid>
			</Grid>
		);
	}
}

const styles = theme => ({
	container: {
		width: '100%',
		padding: theme.spacing.unit * 4
	}
});

export default withStyles(styles)(Index);