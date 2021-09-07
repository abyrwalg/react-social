/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
import React, { useContext, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import classes from './Career.module.css';
import { validateFormArray } from '../../../utils/utils';
import { WorkPlace } from './WorkPlace/WorkPlace';
import { useHttp } from '../../../hooks/http.hook';
import { AuthContext } from '../../../context/AuthContext';

export const Career = (props) => {
  const { data } = props;

  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [addedFormElementsCounter, setAddedFormElementsCounter] = useState(0);
  const [form, setForm] = useState(
    data.map((element) => {
      const form = {
        workplace: {
          value: element.workplace,
          type: 'text',
          label: 'Место работы',
          placeholder: 'Укажите место работы',
          validation: {
            required: true,
            min: 3,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        city: {
          value: element.city,
          type: 'text',
          label: 'Город',
          placeholder: 'Укажите город',
          validation: {
            required: false,
            min: 3,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        position: {
          value: element.position,
          type: 'text',
          label: 'Должность',
          placeholder: 'Укажите должность',
          validation: {
            required: false,
            min: 3,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        yearStart: {
          value: element.yearStart,
          type: 'text',
          label: 'Год начала работы',
          placeholder: 'Укажите год начала работы',
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
          label: 'Год окончания работы',
          placeholder: 'Укажите год окончания работы',
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

  const addJobHandler = () => {
    setForm((prevForm) => [
      ...prevForm,
      {
        workplace: {
          value: '',
          type: 'text',
          label: 'Место работы',
          placeholder: 'Укажите место работы',
          validation: {
            required: true,
            min: 3,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        city: {
          value: '',
          type: 'text',
          label: 'Город',
          placeholder: 'Укажите город',
          validation: {
            required: false,
            min: 3,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        position: {
          value: '',
          type: 'text',
          label: 'Должность',
          placeholder: 'Укажите должность',
          validation: {
            required: false,
            min: 3,
            max: 120,
          },
          isInvalid: false,
          errorMessage: null,
        },
        yearStart: {
          value: '',
          type: 'text',
          label: 'Год начала работы',
          placeholder: 'Укажите год начала работы',
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
          label: 'Год окончания работы',
          placeholder: 'Укажите год окончания работы',
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
        const formPart = {};
        for (const key in element) {
          if (key === 'empty') {
            continue;
          }
          formPart[key] = element[key].value;
        }
        formToSend.push(formPart);
      });
      try {
        await request('api/user/career', 'PUT', formToSend, {
          Authorization: `Bearer ${token}`,
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
    <Card className={classes.Career}>
      <Card.Body>
        <Form noValidate onSubmit={submitFormHandler}>
          {form.map((element, index) =>
            !element.removed ? (
              <WorkPlace
                // eslint-disable-next-line react/no-array-index-key
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
                onClick={addJobHandler}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
              >
                +Добавить место работы
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
  );
};
