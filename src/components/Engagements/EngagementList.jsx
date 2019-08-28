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
    <>
      {data.map((engagement, index) => (
        <Fade opposite delay={transitionDelay} key={uid(engagement)}>
          <>
            <Engagement data={engagement} />

            {index < data.length - 1 && <Divider />}
          </>
        </Fade>
      ))}
    </>
  );
};

List.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

export default List;
