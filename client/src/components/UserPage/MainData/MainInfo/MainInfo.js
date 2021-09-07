/* eslint-disable react/destructuring-assignment */
import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const MainInfo = (props) => {
  const formatteDate = new Date(props.data.birthdate).toLocaleDateString(
    'ru-RU',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
  return (
    <>
      <div>
        <Row>
          <Col lg={4}>
            <p className="text-muted mb-0">День рождения: </p>
          </Col>
          <Col lg={8}>
            <p className="mb-2">{formatteDate}</p>
          </Col>
        </Row>
        {props.data.country ? (
          <Row>
            <Col lg={4}>
              <p className="text-muted mb-0">Страна: </p>
            </Col>
            <Col lg={8}>
              <p className="mb-2">{props.data.country}</p>
            </Col>
          </Row>
        ) : null}
        {props.data.city ? (
          <Row>
            <Col lg={4}>
              <p className="text-muted mb-0">Город: </p>
            </Col>
            <Col lg={8}>
              <p className="mb-2">{props.data.city}</p>
            </Col>
          </Row>
        ) : null}
      </div>
    </>
  );
};
