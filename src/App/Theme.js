import WebFont from 'webfontloader';
import { createMuiTheme } from '@material-ui/core/styles';

WebFont.load({
	google: {
		families: ['Playfair Display', 'Muli']
	}
});

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#E8C3B8',
			main: '#C66470',
			dark: '#B24D59',
			contrastText: '#F4F4E0'
		},
		secondary: {
			light: '#E8C3B8',
			main: '#E8C3B8',
			dark: '#E8C3B8',
			contrastText: '#1A1A1'
		}
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
	}
});

export default theme;