import React from 'react';
import './index.css';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Theme from './Theme';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ContentWrapper from './Wrapper';
import NotFound from './NotFound';
import Home from '../Home';
import About from '../About';
import Engagements from '../Engagements';
import Media from '../Media';
import Resume from '../Resume';

const App = props => (
	<MuiThemeProvider theme={Theme}>
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={ContentWrapper(Home)} />
				<Route path='/about' component={ContentWrapper(About)} />
				<Route path='/engagements' component={ContentWrapper(Engagements)} />
				<Route path='/media' component={ContentWrapper(Media)} />
				<Route path='/resume' component={ContentWrapper(Resume)} />
				<Route component={ContentWrapper(NotFound)} />
			</Switch>
		</BrowserRouter>
	</MuiThemeProvider>
);

export default App;
