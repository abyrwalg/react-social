/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-useless-escape */
import React from 'react';

import Form from 'react-bootstrap/Form';

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const validateForm = (formData, setForm) => {
  let updatedFormData = {};
  let valid = true;

  for (const input in formData) {
    const updatedInputData = { ...formData[input] };
    // Validate email
    updatedInputData.isInvalid = false;
    if (
      formData[input].validation.type === 'email' &&
      !validateEmail(formData[input].value.trim())
    ) {
      updatedInputData.isInvalid = true;
      updatedInputData.errorMessage = 'Введите корректный email';
    }

    // Validate password confirmation
    if (input === 'passwordConfirm' && formData.password.value.trim() !== '') {
      if (formData[input].value.trim() !== formData.password.value) {
        updatedInputData.isInvalid = true;
        updatedInputData.errorMessage = 'Пароли не совпадают';
      }
    }

    // Validate length
    if (formData[input].validation.min && formData[input].validation.max) {
      if (
        (formData[input].value.trim().length < formData[input].validation.min ||
          formData[input].value.trim().length >
            formData[input].validation.max) &&
        formData[input].value.trim() !== ''
      ) {
        updatedInputData.isInvalid = true;
        updatedInputData.errorMessage = `Длина поля должна составлять от ${formData[input].validation.min} до ${formData[input].validation.max} символов`;
      }
    }

    if (
      formData[input].validation.required &&
      formData[input].value.trim() === ''
    ) {
      updatedInputData.isInvalid = true;
      updatedInputData.errorMessage = 'Необходимо заполнить это поле';
    }

    if (updatedInputData.isInvalid) {
      valid = false;
    }

    updatedFormData = { ...updatedFormData, [input]: updatedInputData };
  }

  setForm(updatedFormData);
  return valid;
};

export const validateFormArray = (formArray, setForm) => {
  let valid = true;

  formArray.forEach((formData, index) => {
    if (formData.removed) {
      return;
    }
    let updatedFormData = {};
    for (const input in formData) {
      if (input === 'empty') {
        updatedFormData = { ...updatedFormData, empty: true };
        // continue;
        return;
      }
      const updatedInputData = { ...formData[input] };
      // Validate email
      updatedInputData.isInvalid = false;
      if (
        formData[input].validation.type === 'email' &&
        !validateEmail(formData[input].value.trim())
      ) {
        updatedInputData.isInvalid = true;
        updatedInputData.errorMessage = 'Введите корректный email';
      }

      // Validate password confirmation
      if (
        input === 'passwordConfirm' &&
        formData.password.value.trim() !== ''
      ) {
        if (formData[input].value.trim() !== formData.password.value) {
          updatedInputData.isInvalid = true;
          updatedInputData.errorMessage = 'Пароли не совпадают';
        }
      }

      // Validate length
      if (formData[input].validation.min && formData[input].validation.max) {
        if (
          (formData[input].value.trim().length <
            formData[input].validation.min ||
            formData[input].value.trim().length >
              formData[input].validation.max) &&
          formData[input].value.trim() !== ''
        ) {
          updatedInputData.isInvalid = true;
          updatedInputData.errorMessage = `Длина поля должна составлять от ${formData[input].validation.min} до ${formData[input].validation.max} символов`;
        }
      }

      // Validate year
      if (formData[input].validation.type === 'year') {
        if (
          (formData[input].value.trim().length !== 4 ||
            // eslint-disable-next-line no-restricted-globals
            isNaN(formData[input].value.trim()) ||
            formData[input].value.charAt(0) === '0') &&
          formData[input].value.trim() !== ''
        ) {
          updatedInputData.isInvalid = true;
          updatedInputData.errorMessage = `Введите корректный год`;
        }
      }

      if (
        formData[input].validation.required &&
        formData[input].value.trim() === ''
      ) {
        updatedInputData.isInvalid = true;
        updatedInputData.errorMessage = 'Необходимо заполнить это поле';
      }

      if (updatedInputData.isInvalid) {
        valid = false;
      }

      updatedFormData = { ...updatedFormData, [input]: updatedInputData };
    }

    setForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index] = updatedFormData;
      return newForm;
    });
  });

  return valid;
};

const inputHandler = (event, form, setForm) => {
  const newValue = event.target.value;
  const inputObject = {
    ...form[event.target.name],
    value: newValue,
    isInvalid: false,
  };

  setForm((prevForm) => {
    return { ...prevForm, [event.target.name]: inputObject };
  });
};

export const formSubmitHandler = (event, form, setForm, url) => {
  event.preventDefault();
  const isValid = validateForm(form, setForm);

  if (isValid) {
    const clearedFormData = {};

    for (const key in form) {
      clearedFormData[key] = form[key].value;
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(clearedFormData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log(error));
  }
};

export const createForm = (formData, setForm) => {
  const formContent = [];
  for (const key in formData) {
    formContent.push(
      <Form.Group controlId={`formBasic${key}`} key={key}>
        <Form.Label>{formData[key].label}</Form.Label>
        <Form.Control
          type={formData[key].type}
          name={key}
          placeholder={formData[key].placeholder}
          value={formData[key].value}
          onChange={(event) => inputHandler(event, formData, setForm)}
          isInvalid={formData[key].isInvalid}
          as={formData[key].type === 'textarea' ? 'textarea' : 'input'}
          maxLength="512"
        />
        <Form.Control.Feedback type="invalid">
          {formData[key].errorMessage}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
  return formContent;
};

export const createFormPart = (form, changeHandler) => {
  const JSX = [];

  for (const key in form) {
    if (key === 'empty') {
      // eslint-disable-next-line no-continue
      continue;
    }
    JSX.push(
      <Form.Group controlId="formBasicName" key={key}>
        <Form.Label>{form[key].label}</Form.Label>
        <Form.Control
          type={form[key].type}
          name={key}
          placeholder={form[key].placeholder}
          value={form[key].value}
          onChange={changeHandler}
          isInvalid={form[key].isInvalid}
        />
        <Form.Control.Feedback type="invalid">
          {form[key].errorMessage}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
  return JSX;
};
