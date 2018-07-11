import React from 'react';
import Keys from './keys';
import Loading from './Loading';
import detectIt from 'detect-it';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DownloadIcon from 'mdi-material-ui/CloudDownload';

const NotFound = props => (
	<div>
		<Typography variant='headline' color='secondary' gutterBottom>
			Could not display PDF
		</Typography>
		<a href={props.url} className={props.className}>
			<Typography variant='subtitle' color='inherit'>
				Download Instead
			</Typography>
		</a>
	</div>
);

class Resume extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		
		this.state = {
			loading: true,
			width: window.innerWidth
		};
		this.updateWidth = this.updateWidth.bind(this);
	}
	
	componentWillMount() {
		this.updateWidth();
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'about' }).then(res => {
			this.setState({
				resume: res.items[0].fields.resume.fields.file.url
			});
		});
		
		window.addEventListener('resize', this.updateWidth);
	}
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWidth);
	}
	
	updateWidth() {
		const maxWidth = 820;
		const width = window.innerWidth > maxWidth ? maxWidth : (window.innerWidth - 40);
		
		if(width !== this.state.width && detectIt.deviceType !== 'touchOnly')
			this.setState({ width });
	}
	
	render() {
		const { classes } = this.props;
		
		return (
			<div className={classes.container}>
				{this.state.loading &&
					<Loading />
				}
				{this.state.resume &&
					<Document file={this.state.resume}
					          loading={null}
					          onLoadSuccess={() => this.setState({ loading: false })}
					          noData={
						          <NotFound url={this.state.resume} className={classes.link} />
					          }
					>
							
							<Page pageNumber={1}
							      width={this.state.width}
							>
								<a href={this.state.resume} className={classes.button}>
									<Button variant='fab' mini>
										<DownloadIcon />
									</Button>
								</a>
							</Page>
					</Document>
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
		paddingTop: theme.spacing.unit * 2
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