import React from 'react';
import './index.css';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Theme from './Theme';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Wrapper from './Wrapper';
import NotFound from './NotFound';
import Home from '../Home';
import About from '../About';
import Engagements from '../Engagements';
import Photos from '../Photos';
import Audio from '../Media';
import Resume from '../Resume';
import Contact from '../Contact';

const App = props => {
	return (
		<MuiThemeProvider theme={Theme}>
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={Wrapper(Home)} />
					<Route path='/about' component={Wrapper(About)} />
					<Route path='/engagements' component={Wrapper(Engagements)} />
					<Route path='/photos' component={Wrapper(Photos)} />
					<Route path='/audio' component={Wrapper(Audio)} />
					<Route path='/resume' component={Wrapper(Resume)} />
					<Route path='/contact' component={Wrapper(Contact)} />
					<Route component={Wrapper(NotFound)} />
				</Switch>
			</BrowserRouter>
		</MuiThemeProvider>
	);
};

export default App;
