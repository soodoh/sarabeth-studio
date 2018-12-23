import React from 'react';
import Keys from '../keys';
import Loading from '../Loading';
import Title from '../Title';
import List from './List';
import Moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class EngagementsPageCore extends React.Component {
	constructor(props) {
		super(props);

		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.getUpcoming = this.getUpcoming.bind(this);
		this.getPast = this.getPast.bind(this);

		this.state = {
			engagements: [],
			loading: true,
		};
	}

	componentDidMount() {
		this.client.getEntries({ content_type: 'engagements', order: 'fields.endDate' }).then(res => {
			this.setState({
				loading: false,
				engagements: res.items,
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
		}).reverse();
	}

	render() {
		const { classes } = this.props;
		const upcoming = this.getUpcoming();
		const past = this.getPast();

		if(this.state.loading)
			return <Loading />;

		return (
			<Grid container spacing={8} className={classes.container}>
				{upcoming &&
					<Grid item xs={12}>
						<Grid item xs={12}>
							<Title>Upcoming</Title>
						</Grid>
						<Grid item xs={12}>
							<List data={upcoming} />
						</Grid>
					</Grid>
				}

				<Grid item xs={12}>
					<Title>Past</Title>
				</Grid>
				<Grid item xs={12}>
					{past ?
						<List data={past} /> :
						<Typography variant="h5" color="inherit" align="center">
							There are currently no engagements
						</Typography>
					}
				</Grid>
			</Grid>
		);
	}
}

const styles = theme => ({
	container: {
		width: '100%',
		padding: theme.spacing.unit * 4,
		color: theme.palette.primary.contrastText,
	},
});

export default withStyles(styles)(EngagementsPageCore);
