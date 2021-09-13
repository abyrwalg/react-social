import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import UserImageBlock from './UserImageBlock/UserImageBlock';
import MainData from './MainData/MainData';
import Spinner from '../UI/Spinner/Spinner';
import Wall from './Wall/Wall';
import { useHttp } from '../../hooks/http.hook';

import classes from './UserPage.module.css';

const UserInfo = () => {
  const [userData, setUserData] = useState(null);
  const { request } = useHttp();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await request(`/api/user/${id}`, 'GET');
        setUserData(data);
      } catch (error) {
        console.log(error);
        history.push('/');
      }
    }
    fetchData();
  }, [id, request]);

  return userData ? (
    <Row className={classes.UserPage}>
      <Col lg={4}>
        <UserImageBlock avatar={userData.header.avatar} id={id} />
      </Col>
      <Col lg={8}>
        <MainData userData={userData} id={id} />
        <Wall id={userData._id} />
      </Col>
    </Row>
  ) : (
    <Spinner />
  );
};

export default UserInfo;
