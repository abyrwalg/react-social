/* eslint-disable import/named */
/* eslint-disable react/destructuring-assignment */
import React, { useContext, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import classes from './PersonalData.module.css';
import { createForm, validateForm } from '../../../utils/utils';
import { useHttp } from '../../../hooks/http.hook';
import { AuthContext } from '../../../context/AuthContext';

export const PersonalData = (props) => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [form, setForm] = useState({
    interests: {
      value: props.data.interests,
      type: 'textarea',
      label: 'Интересы',
      placeholder: 'Перечислите свои интересы',
      validation: {
        required: false,
        min: 1,
        max: 512,
      },
      isInvalid: false,
      errorMessage: null,
    },
    favoriteBooks: {
      value: props.data.favoriteBooks,
      type: 'textarea',
      label: 'Любимые книги',
      placeholder: 'Перечислите свои любимые книги',
      validation: {
        required: false,
        min: 1,
        max: 512,
      },
      isInvalid: false,
      errorMessage: null,
    },
    favoriteMovies: {
      value: props.data.favoriteMovies,
      type: 'textarea',
      label: 'Любимые фильмы',
      placeholder: 'Перечислите свои любимые фильмы',
      validation: {
        required: false,
        min: 1,
        max: 512,
      },
      isInvalid: false,
      errorMessage: null,
    },
    favoriteMusic: {
      value: props.data.favoriteMusic,
      type: 'textarea',
      label: 'Любимая музыка',
      placeholder: 'Перечислите любимых исполнителей',
      validation: {
        required: false,
        min: 1,
        max: 512,
      },
      isInvalid: false,
      errorMessage: null,
    },
    about: {
      value: props.data.about,
      type: 'textarea',
      label: 'О себе',
      placeholder: 'Расскажите о себе',
      validation: {
        required: false,
        min: 1,
        max: 512,
      },
      isInvalid: false,
      errorMessage: null,
    },
  });

  const submitFormHander = async (event) => {
    event.preventDefault();
    const valid = validateForm(form, setForm);
    if (!valid) {
      return;
    }

    try {
      await request('api/user/personal-data', 'PUT', form, {
        Authorization: `Bearer ${token}`,
      });
      props.showAlert('success', 'Изменения успешно сохранены');
      props.alertRef.current.scrollIntoView();
    } catch (error) {
      console.log(error);
      props.showAlert('danger', error.message);
      props.alertRef.current.scrollIntoView();
    }
  };

  return (
    <Card className={classes.PersonalData} onSubmit={submitFormHander}>
      <Card.Body>
        <Form noValidate>
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
