/* eslint-disable react/destructuring-assignment */
import React, { useContext, useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';

import classes from './AvatarModal.module.css';
import { AuthContext } from '../../../../context/AuthContext';
import { useHttp } from '../../../../hooks/http.hook';
import defaultUserpic from '../../../../assets/images/default-userpic.png';
import { getAuthData } from '../../../../helpers/authStorage';

export const AvatarModal = (props) => {
  const { request, loading: loadingHook } = useHttp();
  const { changeAvatar } = useContext(AuthContext);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    isInvalid: false,
    message: 'Выберите аватар',
  });
  const [loading, setLoading] = useState(false);
  const avatarUrl = props.avatar ? `/${props.avatar}` : defaultUserpic;

  const uploadChangeHandler = (event) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(event.target.files[0].name)) {
      setUploadStatus({
        isInvalid: true,
        message: 'Поддерживаются только изображения форматов JPEG, PNG и GIF',
      });
    } else if (event.target.files[0].size > 1024 * 1024 * 2) {
      setUploadStatus({
        isInvalid: true,
        message: 'Размер изображения не должен превышать 2 МБ',
      });
    } else {
      setUploadFile(event.target.files[0]);
      setUploadStatus({
        isInvalid: false,
        message: event.target.files[0].name,
      });
    }
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('avatar', uploadFile);
    try {
      setLoading(true);
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthData().token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        props.setAvatar(result.avatar);
        changeAvatar(result.avatar);
        setUploadStatus({ isInvalid: false, message: '' });
        setUploadFile('');
        props.handleClose();
      } else {
        setUploadStatus({ isInvalid: true, message: result.message });
        setUploadFile('');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setUploadStatus({ isInvalid: true, message: error.message });
    }
  };

  const deleteAvatarHandler = async () => {
    try {
      await request('/api/user/avatar', 'DELETE');
      changeAvatar('');
      props.setAvatar(null);
      props.handleClose();
      setUploadFile('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={() => {
        setUploadFile(null);
        setUploadStatus({
          isInvalid: false,
          message: 'Выберите аватар',
        });
        props.handleClose();
      }}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Ваш аватар</Modal.Title>
      </Modal.Header>
      <Modal.Body className={classes.modalBody}>
        <Image
          src={uploadFile ? URL.createObjectURL(uploadFile) : avatarUrl}
          fluid
        />
      </Modal.Body>
      <Modal.Footer className={classes.modalFooter}>
        <Form className={classes.uploadForm} onSubmit={submitFormHandler}>
          <Form.File
            id="custom-file"
            label={uploadStatus.message}
            custom
            data-browse="Выбрать"
            onChange={uploadChangeHandler}
            isInvalid={uploadStatus.isInvalid}
            className={classes.imageInput}
            accept=".png,.jpg,.jpeg,.gif"
          />
          <Button
            variant="primary"
            type="submit"
            disabled={uploadStatus.isInvalid || loading || !uploadFile}
          >
            Обновить
          </Button>
        </Form>
        <div className={classes.buttonContainer}>
          <Button
            variant="secondary"
            onClick={deleteAvatarHandler}
            className={classes.deleteButton}
            disabled={!props.avatar || loadingHook}
          >
            Удалить аватар
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
