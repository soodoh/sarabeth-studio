import React from 'react';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';
import Divider from '@material-ui/core/Divider';
import Engagement from './EngagementRow';

const List = (props) => {
  const { data } = props;

  return (
    <div>
      {data.map((engagement, index) => (
        <div key={uid(engagement)}>
          <Engagement data={engagement} />

          {index < data.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
};

List.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};

export default List;
