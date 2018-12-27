import React from 'react';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Engagement from './EngagementRow';

const ListCore = (props) => {
  const { classes, data } = props;

  return (
    <div>
      {data.map((engagement, index) => (
        <div key={uid(engagement)}>
          <Engagement data={engagement} />

          {index < data.length - 1 && <Divider className={classes.divider} />}
        </div>
      ))}
    </div>
  );
};

ListCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

const styles = theme => ({
  divider: {
    backgroundColor: theme.palette.primary.contrastText,
  },
});

export default withStyles(styles)(ListCore);
