/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';

import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { createForm, validateForm } from '../../utils/utils';
import { saveAuthData } from '../../helpers/authStorage';

const LoginPage = () => {
  const [form, setForm] = useState({
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
      },
      isInvalid: false,
      errorMessage: null,
    },
  });

  const [alert, setAlert] = useState({
    variant: '',
    message: '',
    show: false,
  });

  const { setIsLoggedIn } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const history = useHistory();

  const formSubmitHandler = async (event, form, setForm, url) => {
    event.preventDefault();
    const isValid = validateForm(form, setForm);

    if (isValid) {
      const clearedFormData = {};

      for (const key in form) {
        clearedFormData[key] = form[key].value;
      }

      try {
        const data = await request(url, 'POST', clearedFormData);
        console.log(data);
        if (data.token) {
          saveAuthData({
            uid: data.data.user.regInfo.uid,
            id: data.data.user._id,
            name: data.data.user.header.name,
            token: data.token,
          });
          setIsLoggedIn(true);
          history.push(`/users/${data.data.user.regInfo.uid}`);
        }
      } catch (error) {
        setAlert({ variant: 'danger', message: error.message, show: true });

        console.log(error);
      }
    }
  };

  return (
    <Row>
      <Col lg={6} className="m-auto">
        {alert.show ? (
          <Alert variant={alert.variant}>{alert.message}</Alert>
        ) : null}
        <Card>
          <Card.Body>
            <Card.Title style={{ textAlign: 'center' }}>
              Добро пожаловать!
            </Card.Title>
            <Form
              noValidate
              onSubmit={(event) =>
                formSubmitHandler(event, form, setForm, 'api/auth/login')
              }
            >
              {createForm(form, setForm)}
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                Войти
              </Button>
            </Form>
            <Card.Text
              className="text-muted mt-2"
              style={{ textAlign: 'center' }}
            >
              Нет аккаунта? <Link to="/signup">Зарегистрируйтесь.</Link>
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
