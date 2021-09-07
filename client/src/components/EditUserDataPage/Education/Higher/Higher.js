/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-continue */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
import React, { useContext, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import 'font-awesome/css/font-awesome.min.css';

import { HigherElem } from './HigherElem/HigherElem';
import classes from './Higher.module.css';
import { validateFormArray } from '../../../../utils/utils';
import { AuthContext } from '../../../../context/AuthContext';
import { useHttp } from '../../../../hooks/http.hook';

export const Higher = (props) => {
  const { data } = props;

  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [addedFormElementsCounter, setAddedFormElementsCounter] = useState(0);
  const [form, setForm] = useState(
    data.map((element) => {
      const form = {
        name: {
          value: element.name,
          type: 'text',
          label: 'Вуз',
          placeholder: 'Укажите название вуза',
          validation: {
            required: true,
            min: 1,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        specialty: {
          value: element.specialty,
          type: 'text',
          label: 'Специальность',
          placeholder: 'Укажите специальность',
          validation: {
            required: false,
            min: 1,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        status: {
          value: element.status,
          type: 'text',
          label: 'Статус',
          placeholder: 'Укажите статус (например, студент)',
          validation: {
            required: false,
            min: 1,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        yearStart: {
          value: element.yearStart,
          type: 'text',
          label: 'Год начала обучения',
          placeholder: 'Укажите год начала обучения',
          validation: {
            required: false,
            type: 'year',
          },
          isInvalid: false,
          errorMessage: null,
        },
        yearEnd: {
          value: element.yearEnd,
          type: 'text',
          label: 'Год окончания обучения',
          placeholder: 'Укажите год окончания обучения',
          validation: {
            required: false,
            type: 'year',
          },
          isInvalid: false,
          errorMessage: null,
        },
      };
      return form;
    })
  );

  const addInstitutionHandler = () => {
    setForm((prevForm) => [
      ...prevForm,
      {
        name: {
          value: '',
          type: 'text',
          label: 'Вуз',
          placeholder: 'Укажите название вуза',
          validation: {
            required: true,
            min: 1,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        specialty: {
          value: '',
          type: 'text',
          label: 'Специальность',
          placeholder: 'Укажите специальность',
          validation: {
            required: false,
            min: 1,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        status: {
          value: '',
          type: 'text',
          label: 'Статус',
          placeholder: 'Укажите статус (например, студент)',
          validation: {
            required: false,
            min: 1,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        yearStart: {
          value: '',
          type: 'text',
          label: 'Год начала обучения',
          placeholder: 'Укажите год начала обучения',
          validation: {
            required: false,
            type: 'year',
          },
          isInvalid: false,
          errorMessage: null,
        },
        yearEnd: {
          value: '',
          type: 'text',
          label: 'Год окончания обучения',
          placeholder: 'Укажите год окончания обучения',
          validation: {
            required: false,
            type: 'year',
          },
          isInvalid: false,
          errorMessage: null,
        },
        empty: true,
      },
    ]);
    setAddedFormElementsCounter((prevCounter) => prevCounter + 1);
  };

  const showHiddenFormElement = (index) => {
    setForm((prevForm) => {
      const newForm = [...prevForm];
      delete newForm[index].removed;
      return newForm;
    });
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const valid = validateFormArray(form, setForm);

    if (valid) {
      const formToSend = [];

      form.forEach((element) => {
        if (element.removed) {
          return;
        }
        const formPart = { type: 'Вуз' };
        for (const key in element) {
          if (key === 'empty') {
            continue;
          }
          formPart[key] = element[key].value;
        }
        formToSend.push(formPart);
      });
      try {
        await request('api/user/education', 'PUT', formToSend, {
          Authorization: `Bearer ${token}`,
          institution: 'higher',
        });

        props.showAlert('success', 'Изменения успешно сохранены');

        props.alertRef.current.scrollIntoView();
        setForm((prevForm) => {
          console.log(prevForm);
          const updatedForm = prevForm.filter((element) => !element.removed);
          updatedForm.forEach((element) => {
            delete element.empty;
          });

          return updatedForm;
        });
        setAddedFormElementsCounter(0);
      } catch (error) {
        console.log(error);
        props.showAlert('danger', error.message);
        props.alertRef.current.scrollIntoView();
      }
    }
  };

  return (
    <>
      <Card className={classes.Higher}>
        <Card.Body>
          <Form noValidate onSubmit={submitFormHandler}>
            {form.map((element, index) =>
              !element.removed ? (
                <HigherElem
                  key={index}
                  form={element}
                  setForm={setForm}
                  fullForm={form}
                  setCounter={setAddedFormElementsCounter}
                />
              ) : (
                <p className={classes.hiddenMessage}>
                  <span
                    className={classes.undo}
                    onClick={() => showHiddenFormElement(index)}
                  >
                    Не удалять
                  </span>
                  <span className={classes.hiddenInfo}>
                    Эта запись будет удалена после сохранения изменений
                  </span>
                </p>
              )
            )}
            {addedFormElementsCounter < 3 ? (
              <>
                <p
                  className={classes.addInstitution}
                  onClick={addInstitutionHandler}
                  role="button"
                >
                  +Добавить учебное заведение
                </p>
                <hr />
              </>
            ) : null}

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
      <hr />
    </>
  );
};
