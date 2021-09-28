import React, { ReactElement } from 'react';
import Divider from '@material-ui/core/Divider';
import Fade from 'react-reveal/Fade';
import EngagementRow from './EngagementRow';
import { Engagement } from '../../types';

interface ListProps {
  data: Engagement[];
}

const List = (props: ListProps): ReactElement => {
  const { data } = props;
  const transitionDelay = 200;

  return (
    <>
      {data.map((engagement, index) => (
        <Fade opposite delay={transitionDelay} key={engagement.id}>
          <>
            <EngagementRow data={engagement} />
            {index < data.length - 1 && <Divider />}
          </>
        </Fade>
      ))}
    </>
  );
};

export default List;
