import React from 'react';
import Keys from '../keys';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Gallery from './Gallery';
import Title from '../Title';
import Filters from '../Filters';

class Photos extends React.Component {
	constructor(props) {
		super(props);
		
		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.getAlbums = this.getAlbums.bind(this);
		this.getPhotos = this.getPhotos.bind(this);
		
		this.state = {
			albums: [],
			currentAlbum: 'All',
			loading: true
		};
	}
	
	componentDidMount() {
		this.client.getEntries({ content_type: 'photoAlbums', order: 'fields.label' }).then(res => {
			this.setState({
				albums: res.items,
				loading: false
			});
		});
	}
	
	getAlbums() {
		const albums = this.state.albums
			.map(group => group.fields.label);
		
		albums.unshift('All');
		
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
			src: photo.fields.file.url,
			caption: photo.fields.description
		}));
	}
	
	render() {
		const { classes } = this.props;
		
		if(this.state.loading)
			return <div>Loading</div>;
			
		return (
			<Grid container spacing={8} className={classes.container}>
				<Grid item xs={12}>
					<Title>Photos</Title>
				</Grid>
				
				{this.state.albums.length > 1 &&
					<Filters list={this.getAlbums()}
					         activeItem={this.state.currentAlbum}
					         onClick={album => this.setState({ currentAlbum: album })}
					/>
				}
				
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
	}
});

export default withStyles(styles)(Photos);