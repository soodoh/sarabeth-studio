import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import Lightbox from 'react-images';

const CustomLightbox = (props) => {
	const { theme, ...others } = props;
	const themeProp = {
		container: {
			fontFamily: theme.typography.fontFamily
		},
		footer: {
			color: theme.palette.primary.light
		},
		footerCount: {
			color: theme.palette.primary.light
		},
		arrow: {
			fill: theme.palette.primary.light
		},
		close: {
			fill: theme.palette.primary.light
		}
	};
	
	return (
		<Lightbox
			theme={themeProp}
			backdropClosesModal
			{...others}
		/>
	);
};

export default withTheme()(CustomLightbox);