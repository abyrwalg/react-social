/* eslint-disable react/destructuring-assignment */
import React, { useContext, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import classes from './MainData.module.css';
import { createForm, validateForm } from '../../../utils/utils';
import { useHttp } from '../../../hooks/http.hook';
import { AuthContext } from '../../../context/AuthContext';

export const MainData = (props) => {
  const { token, changeUsername } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const date = new Date(props.data.birthdate);
  const birthdateFieldValue = `${date.getFullYear().toString()}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;

  const [form, setForm] = useState({
    name: {
      value: props.data.name,
      type: 'text',
      label: 'Имя',
      placeholder: 'Введите имя',
      validation: {
        required: true,
        min: 1,
        max: 120,
      },
      isInvalid: false,
      errorMessage: null,
    },
    surname: {
      value: props.data.surname,
      type: 'text',
      label: 'Фамилия',
      placeholder: 'Введите фамилию',
      validation: {
        required: true,
        min: 1,
        max: 120,
      },
      isInvalid: false,
      errorMessage: null,
    },
    birthdate: {
      value: birthdateFieldValue,
      type: 'date',
      label: 'День рождения',
      validation: {
        required: true,
      },
      isInvalid: false,
      errorMessage: null,
    },
    country: {
      value: props.data.country,
      type: 'text',
      label: 'Страна',
      placeholder: 'Введите страну проживания',
      validation: {
        required: false,
        min: 1,
        max: 120,
      },
      isInvalid: false,
      errorMessage: null,
    },
    city: {
      value: props.data.city,
      type: 'text',
      label: 'Город',
      placeholder: 'Введите город проживания',
      validation: {
        required: false,
        min: 1,
        max: 120,
      },
      isInvalid: false,
      errorMessage: null,
    },
  });

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const valid = validateForm(form, setForm);
    if (valid) {
      try {
        await request('api/user/main-data', 'PUT', form, {
          Authorization: `Bearer ${token}`,
        });
        changeUsername(form.name.value);
        props.showAlert('success', 'Изменения успешно сохранены');
        props.alertRef.current.scrollIntoView();
      } catch (error) {
        console.log(error);
        props.showAlert('danger', error.message);
        props.alertRef.current.scrollIntoView();
      }
    }
  };

  return (
    <Card className={classes.MainData}>
      <Card.Body>
        <Form noValidate onSubmit={submitFormHandler}>
          {createForm(form, setForm)}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            Сохранить
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
