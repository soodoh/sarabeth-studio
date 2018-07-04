import React from 'react';
import Keys from '../keys';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Gallery from './Gallery';

class Index extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.getAlbums = this.getAlbums.bind(this);
		this.getPhotos = this.getPhotos.bind(this);
		
		this.state = {
			albums: [],
			currentAlbum: '',
			loading: true
		};
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'photoAlbums' }).then(res => {
			this.setState({
				albums: res.items,
				currentAlbum: 'All',
				loading: false
			});
		});
	}
	
	getAlbums() {
		const albums = ['All'];
		this.state.albums
			.sort((a, b) => a.fields.label > b.fields.label)
			.forEach(album => {
				albums.push(album.fields.label);
			});
		
		return albums;
	}
	
	getPhotos() {
		let photos = [];
		
		if(this.state.currentAlbum === 'All') {
			this.state.albums.forEach(album => {
				photos = [...photos, ...album.fields.photos];
			});
		} else {
			const albumPhotos = this.state.albums.find(album => album.fields.label === this.state.currentAlbum);
			photos = albumPhotos.fields.photos;
		}
		
		return photos.map(photo => ({
			title: photo.fields.title,
			url: photo.fields.file.url,
			isPortrait: photo.fields.file.details.image.width < photo.fields.file.details.image.height
		}));
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
				
				<Grid item xs={12} className={classes.buttonGroup}>
					{this.getAlbums().map((album, index) => (
						<Button key={index}
						        variant='raised'
						        className={this.state.currentAlbum === album ? classes.active : classes.button}
						        onClick={() => this.setState({ currentAlbum: album })}
						>
							{album}
						</Button>
					))}
				</Grid>
				
				<Grid item xs={12}>
					<Gallery photos={this.getPhotos()} />
				</Grid>
			</Grid>
		);
	}
}

const styles = theme => ({
	container: {
		width: '100%',
		padding: theme.spacing.unit * 4
	},
	title: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText,
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`
	},
	buttonGroup: {
		display: 'flex',
		justifyContent: 'space-around',
		marginTop: theme.spacing.unit * 4
	},
	button: {
		backgroundColor: theme.palette.secondary.dark,
		color: theme.palette.primary.contrastText,
		borderRadius: 0,
		
		'&:hover': {
			backgroundColor: 'transparent'
		}
	},
	active: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		borderRadius: 0,
		
		'&:hover': {
			backgroundColor: theme.palette.primary.light
		}
	}
});

export default withStyles(styles)(Index);