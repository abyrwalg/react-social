/* eslint-disable react/destructuring-assignment */
import React from 'react';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { Secondary } from './Secondary/Secondary';
import { Higher } from './Higher/Higher';

export const Education = (props) => {
  const { data } = props;
  const higherData = data.filter((institution) => institution.type === 'Вуз');
  const secondaryData = data.filter(
    (institution) => institution.type === 'Школа'
  );

  return (
    <Tabs defaultActiveKey="secondary" id="uncontrolled-tab-example">
      <Tab eventKey="secondary" title="Среднее">
        <Secondary
          data={secondaryData}
          showAlert={props.showAlert}
          alertRef={props.alertRef}
        />
      </Tab>
      <Tab eventKey="higher" title="Высшее">
        <Higher
          data={higherData}
          showAlert={props.showAlert}
          alertRef={props.alertRef}
        />
      </Tab>
    </Tabs>
  );
};
