import React from 'react';
import Keys from '../keys';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Gallery from './Gallery';
import Title from '../Title';
import Filters from '../Filters';

class PhotosCore extends React.Component {
	constructor(props) {
		super(props);

		const Contentful = require('contentful');
		this.client = Contentful.createClient(Keys);
		this.getAlbums = this.getAlbums.bind(this);
		this.getPhotos = this.getPhotos.bind(this);

		this.state = {
			albums: [],
			currentAlbum: 'All',
			loading: true,
		};
	}

	componentDidMount() {
		this.client.getEntries({ content_type: 'photoAlbums', order: 'fields.label' }).then(res => {
			this.setState({
				albums: res.items,
				loading: false,
			});
		});
	}

	getAlbums() {
    const { albums } = this.state;
    const albumNames = albums.map(group => group.fields.label);

		albumNames.unshift('All');

		return albumNames;
	}

	getPhotos() {
    const { currentAlbum, albums } = this.state;
		let photos = [];

		if(currentAlbum === 'All') {
			albums.forEach(album => {
				photos = [...photos, ...album.fields.photos];
			});
		} else {
			const albumPhotos = albums.find(album => album.fields.label === currentAlbum);
			photos = albumPhotos.fields.photos;
		}

		return photos.map(photo => ({
			title: photo.fields.title,
			src: photo.fields.file.url,
			caption: photo.fields.description,
		}));
	}

	render() {
    const { classes } = this.props;
    const { loading, albums, currentAlbum } = this.state;

		if(loading)
			return <div>Loading</div>;

		return (
			<Grid container spacing={8} className={classes.container}>
				<Grid item xs={12}>
					<Title>Photos</Title>
				</Grid>

				{albums.length > 1 &&
					<Filters list={this.getAlbums()}
					         activeItem={currentAlbum}
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
		padding: theme.spacing.unit * 4,
	},
});

export default withStyles(styles)(PhotosCore);
