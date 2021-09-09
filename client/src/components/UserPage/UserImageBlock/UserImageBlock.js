/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { AvatarModal } from './AvatarModal/AvatarModal';

import classes from './UserImageBlock.module.css';
import defaultUserpic from '../../../assets/images/default-userpic.png';
import { getAuthData } from '../../../helpers/authStorage';

const UserImageBlock = (props) => {
  const { uid } = getAuthData();
  const [showModal, setShowModal] = useState(false);
  const [avatar, setAvatar] = useState(props.avatar);

  const avatarUrl = avatar ? `/${avatar}` : defaultUserpic;
  const allowAvatarChange = uid === +props.id;
  const clickableClass = allowAvatarChange ? classes.clickable : null;

  const showModalHandler = () => {
    if (!allowAvatarChange) {
      return;
    }
    setShowModal(true);
  };

  const hideModalHandeler = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setAvatar(props.avatar);
  }, [props.avatar]);

  return (
    <>
      <AvatarModal
        show={showModal}
        handleClose={hideModalHandeler}
        avatar={avatar}
        setAvatar={setAvatar}
      />
      <Card className={classes.UserImageBlock}>
        <Card.Img
          variant="top"
          src={avatarUrl}
          className={`p-4 mb-0 ${clickableClass}`}
          onClick={showModalHandler}
          alt="User image"
        />

        <Card.Body className="pt-0">
          <Button variant="primary" className="w-100 mb-1">
            Написать сообщение
          </Button>
          <Button variant="primary" className="w-100">
            Добавить в друзья
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserImageBlock;
