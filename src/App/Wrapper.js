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
	
	const Content = props => {
		const { classes } = props;
		
		return (
			<div className={classes.container}>
				<Header />
				
				<section className={classes.content}>
					<Component />
				</section>
				
				<Footer />
			</div>
		);
	};
	
	return withStyles(styles)(Content);
};

export default Wrapper;