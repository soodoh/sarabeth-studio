import WebFont from 'webfontloader';
import { createMuiTheme } from '@material-ui/core/styles';

WebFont.load({
	google: {
		families: ['Playfair Display', 'Muli']
	}
});

const primary = {
	light: '#E8C3B8',
	main: '#C66470',
	dark: '#B24D59',
	contrastText: '#F4F4E0'
};

const secondary = {
	light: '#F4F4E0',
	main: '#E8C3B8',
	dark: '#443F3E',
	contrastText: '#1A1A1A'
};

const theme = createMuiTheme({
	palette: {
		primary,
		secondary
	},
	typography: {
		fontFamily: `'Muli', sans-serif`,
		display1: {
			fontFamily: `'Playfair Display', cursive`,
			fontStyle: 'italic'
		},
		title: {
			fontFamily: `'Playfair Display', cursive`
		},
		body1: {
			fontSize: '1.2rem',
			paddingBottom: '1.5rem'
		}
	},
	overrides: {
		MuiInput: {
			root: {
				color: primary.contrastText
			},
			underline: {
				'&:before': {
					borderBottom: `1px solid ${primary.contrastText}`
				},
				'&:hover:not($disabled):not($focused):not($error):before': {
					borderBottom: `2px solid ${secondary.main}`
				}
			}
		},
		MuiInputLabel: {
			root: {
				color: primary.contrastText
			}
		}
	}
});

export default theme;