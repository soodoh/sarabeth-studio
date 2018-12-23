import React from 'react';
import Keys from './keys';
import Loading from './Loading';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const Background = props => (
	<div style={{
		backgroundImage: `url(${props.url}?w=1000)`,
		backgroundSize: 'cover',
		backgroundPosition: 'center top',
		backgroundAttachment: 'fixed',
		position: 'fixed',
		top: 0, left: 0, right: 0, bottom: 0,
		zIndex: 0,
	}} />
);

class Home extends React.Component {
	constructor(props) {
		super(props);

		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.state = { loading: true };
	}

	componentDidMount() {
		this.client.getEntries({ content_type: 'home' }).then((res) => {
			const data = res.items[0];
			this.setState({
				loading: false,
				data,
				backgroundImage: data.fields.background.fields.file.url,
			});
		});
	}

	render() {
    const { loading, backgroundImage, data } = this.state;
		const { classes } = this.props;

		if(loading)
			return <Loading />;

		return (
			<div className={classes.container}>
				<Background url={backgroundImage} />

				<Typography
          variant="h4"
          className={classes.title}
          gutterBottom
				>
					{data.fields.title}
				</Typography>
			</div>
		);
	}
}

const styles = theme => ({
	container: {
		display: 'flex',
		padding: theme.spacing.unit * 3,
	},
	title: {
		marginTop: -theme.spacing.unit * 2,
		color: theme.palette.primary.contrastText,
		fontSize: '1.5rem',
	},
});

export default withStyles(styles)(Home);
