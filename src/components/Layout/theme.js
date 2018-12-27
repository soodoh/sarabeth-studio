import grey from '@material-ui/core/colors/grey';
import { createMuiTheme } from '@material-ui/core/styles';

const primary = {
  light: '#E8C3B8',
  main: '#C66470',
  dark: '#B24D59',
  contrastText: '#F4F4E0',
};

const secondary = {
  light: '#F4F4E0',
  main: '#E8C3B8',
  dark: '#443F3E',
  contrastText: '#1A1A1A',
};

const theme = createMuiTheme({
  palette: {
    primary,
    secondary,
    background: {
      default: secondary.contrastText,
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: '\'Muli\', sans-serif',
    h4: {
      fontFamily: '\'Playfair Display\', cursive',
      fontStyle: 'italic',
    },
    title: {
      fontFamily: '\'Playfair Display\', cursive',
    },
    body1: {
      fontSize: '1.2rem',
      paddingBottom: '1.5rem',
    },
  },
  overrides: {
    MuiTypography: {
      root: {
        zIndex: 1,
      },
    },
    MuiInput: {
      root: {
        color: primary.contrastText,
      },
      underline: {
        '&:before': {
          borderBottom: `1px solid ${primary.contrastText}`,
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: `2px solid ${secondary.main}`,
        },
        '&$disabled': {
          borderBottom: `1px dotted ${grey[200]}`,
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: primary.contrastText,
      },
    },
    MuiButton: {
      outlined: {
        color: primary.contrastText,
        border: `1px solid ${primary.contrastText}`,
        borderRadius: 0,
        textTransform: 'none',
      },
    },
  },
});

export default theme;
