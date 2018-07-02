import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import Footer from './Footer';

// So that router props.match is passed to Header
const Wrapper = Component => {
	const styles = theme => ({
		container: {
			position: 'relative',
			minHeight: '100vh',
			display: 'block'
		},
		content: {
			paddingBottom: theme.spacing.unit * 11
		}
	});
	
	const Content = props => (
		<div className={props.classes.container}>
			<Header match={props.match} />
			
			<section className={props.classes.content}>
				<Component />
			</section>
			
			<Footer />
		</div>
	);
	
	return withStyles(styles)(Content);
};

export default Wrapper;