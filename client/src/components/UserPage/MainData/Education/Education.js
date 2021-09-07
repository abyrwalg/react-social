/* eslint-disable react/destructuring-assignment */
import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import classes from './Education.module.css';

export const Education = (props) => {
  if (props.data.length === 0) {
    return <></>;
  }

  props.data.sort((a, b) => b.yearStart - a.yearStart);

  const educationJSX = props.data.map((establishment) => {
    let educationYearsString = '';
    if (establishment.yearStart && establishment.yearEnd) {
      educationYearsString = `с ${establishment.yearStart} по ${establishment.yearEnd} г.`;
    } else if (establishment.yearStart) {
      educationYearsString = `с ${establishment.yearStart} г.`;
    } else if (establishment.yearEnd) {
      educationYearsString = `до ${establishment.yearEnd} г.`;
    }
    return (
      <Row key={establishment.name + establishment.yearStart}>
        <Col lg={4}>
          <p className="text-muted mb-0">{establishment.type}: </p>
        </Col>
        <Col lg={8}>
          <p className="mb-2">
            <span>{establishment.name}</span>
            {establishment.city ? <span>{establishment.city}</span> : null}
            {establishment.specialty ? (
              <span>{establishment.specialty}</span>
            ) : null}
            <span>{establishment.status}</span>
            {educationYearsString && <span>{educationYearsString}</span>}
          </p>
        </Col>
      </Row>
    );
  });
  return (
    <>
      <hr />
      <div className={classes.Education}>
        <h2 className="h5 mb-3">Образование</h2>
        {educationJSX}
      </div>
    </>
  );
};
