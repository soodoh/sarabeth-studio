import React from 'react';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';
import Divider from '@material-ui/core/Divider';
import Fade from 'react-reveal/Fade';
import Engagement from './EngagementRow';

const List = (props) => {
  const { data } = props;
  const transitionDelay = 200;

  return (
    <React.Fragment>
      {data.map((engagement, index) => (
        <Fade opposite delay={transitionDelay}>
          <React.Fragment key={uid(engagement)}>
            <Engagement data={engagement} />

            {index < data.length - 1 && <Divider />}
          </React.Fragment>
        </Fade>
      ))}
    </React.Fragment>
  );
};

List.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

export default List;
