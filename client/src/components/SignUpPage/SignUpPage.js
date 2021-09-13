/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

import { createForm, formSubmitHandler } from '../../utils/utils';
import { saveAuthData } from '../../helpers/authStorage';
import { AuthContext } from '../../context/AuthContext';

const SignUpPage = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [form, setForm] = useState({
    name: {
      value: '',
      type: 'text',
      label: 'Имя',
      placeholder: 'Введите имя',
      validation: {
        required: true,
        min: 3,
        max: 120,
      },
      isInvalid: false,
      errorMessage: null,
    },
    surname: {
      value: '',
      type: 'text',
      label: 'Фамилия',
      placeholder: 'Введите фамилию',
      validation: {
        required: true,
        min: 3,
        max: 120,
      },
      isInvalid: false,
      errorMessage: null,
    },
    birthdate: {
      value: '',
      type: 'date',
      label: 'Дата рождения',
      placeholder: '',
      validation: {
        required: true,
      },
      isInvalid: false,
      errorMessage: null,
    },
    email: {
      value: '',
      type: 'email',
      label: 'Email',
      placeholder: 'Введите email',
      validation: {
        required: true,
        type: 'email',
      },
      isInvalid: false,
      errorMessage: null,
    },
    password: {
      value: '',
      type: 'password',
      label: 'Пароль',
      placeholder: 'Введите пароль',
      validation: {
        required: true,
        min: 8,
        max: 120,
      },
      isInvalid: false,
      errorMessage: null,
    },
    passwordConfirm: {
      value: '',
      type: 'password',
      label: 'Подтверждение пароля',
      placeholder: 'Подтвердите пароль',
      validation: {
        required: true,
      },
      isInvalid: false,
      errorMessage: null,
    },
  });

  const history = useHistory();
  const { setIsLoggedIn } = useContext(AuthContext);

  return (
    <Row>
      <Col lg={6} className="m-auto">
        {alertMessage ? <Alert variant="danger">{alertMessage}</Alert> : null}
        <Card>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center' }}>Регистрация</Card.Title>
            <Form
              noValidate
              onSubmit={(event) =>
                formSubmitHandler(event, form, setForm, 'api/auth/register')
                  .then((response) => {
                    const { data } = response;
                    if (data.token) {
                      saveAuthData({
                        uid: data.data.user.regInfo.uid,
                        id: data.data.user._id,
                        name: data.data.user.header.name,
                        token: data.token,
                        refreshToken: data.data.refreshToken,
                      });
                      setIsLoggedIn(true);
                      history.push(`/users/${data.data.user.regInfo.uid}`);
                    }
                  })
                  .catch((error) => {
                    console.log(error.response.data.message);
                    setAlertMessage(error.response.data.message);
                  })
              }
            >
              {createForm(form, setForm)}
              <Button variant="primary" type="submit" className="w-100">
                Отправить
              </Button>
            </Form>
            <Card.Text
              className="text-muted mt-2"
              style={{ textAlign: 'center' }}
            >
              Уже есть аккаунт? <Link to="/login">Войдите.</Link>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUpPage;
