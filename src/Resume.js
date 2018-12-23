import React from 'react';
import Keys from './keys';
import Loading from './Loading';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const PdfError = props => (
	<div>
		<Typography
      variant='h5'
      align="center"
      color="secondary"
      gutterBottom
    >
			Could not display PDF
		</Typography>
	</div>
);

class Resume extends React.Component {
	constructor(props) {
		super(props);

    const Contentful = require('contentful');
    this.state = { loading: true, error: false };
		this.client = Contentful.createClient(Keys);
	}

	componentDidMount() {
		this.client.getEntries({ content_type: 'about' }).then((res) => {
      const resumeUrl = res.items[0].fields.resume.fields.file.url;

			window.location.href = resumeUrl;
		}).catch((err) => {
      this.setState({ error: true, loading: false })
    });
	}

	render() {
    const { classes } = this.props;
    const { error, loading } = this.state;

		return (
			<div className={classes.container}>
        {error
          && <PdfError />
        }

        {loading
          && <Loading />
				}
			</div>
		);
	}
}

const styles = theme => ({
	container: {
    width: '100%',
		display: 'flex',
		justifyContent: 'center',
	},
	link: {
		color: theme.palette.primary.contrastText,
		textAlign: 'center'
	},
	button: {
		position: 'absolute',
		top: 0, left: 0,
		margin: theme.spacing.unit
	},
	resume: {
		display: 'flex',
		justifyContent: 'center'
	}
});

export default withStyles(styles)(Resume);