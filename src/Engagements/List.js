import React from 'react';
import Engagement from './Engagement';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const List = props => {
	const { classes, data } = props;
	
	return (
		<div>
			{data.map((engagement, index) => (
				<div key={index}>
					<Engagement data={engagement} />
					
					{index < data.length - 1 && <Divider className={classes.divider} />}
				</div>
			))}
		</div>
	);
};

const styles = theme => ({
	divider: {
		backgroundColor: theme.palette.primary.contrastText
	}
});

export default withStyles(styles)(List);