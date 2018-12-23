import React from 'react';
import Keys from './keys';
import Loading from './Loading';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Markdown from 'react-markdown';

class AboutCore extends React.Component {
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
				loading: false,
			})
		});
	}

	render() {
    const { loading, data } = this.state;
		const { classes } = this.props;

		if(loading)
			return <Loading />;

		return (
			<Grid container spacing={16} className={classes.container}>
				<Grid item xs={12} sm={6} md={4}>
					<img
            src={data.fields.headshot.fields.file.url}
            alt={data.fields.headshot.fields.title}
            className={classes.headshot}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={8} className={classes.bio}>
					<Typography variant='h2' color='secondary' gutterBottom>
						{data.fields.title}
					</Typography>

					<Markdown className={classes.bodyText}>
						{data.fields.bio}
					</Markdown>
				</Grid>
			</Grid>
		);
	}
}

const styles = theme => ({
	container: {
		color: theme.palette.primary.contrastText,
		padding: theme.spacing.unit * 2,
		width: '100%',
	},
	headshot: {
		width: '100%',
		maxWidth: '400px',
	},
	bio: {
		paddingLeft: theme.spacing.unit * 2,
	},
	bodyText: {
		...theme.typography.body1,
		color: theme.palette.primary.contrastText,
	},
});

export default withStyles(styles)(AboutCore);
