import "font-awesome/css/font-awesome.min.css";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import classes from "./WorkPlace.module.css";
import { createFormPart } from "../../../../utils/utils";

export const WorkPlace = (props) => {
  const { form, setForm, fullForm, setCounter } = props;

  const hideFormElementHandler = () => {
    const index = fullForm.indexOf(form);
    setForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index].removed = true;
      return newForm;
    });
  };

  const deleteEmptyFormElementHandler = () => {
    const index = fullForm.indexOf(form);
    setForm((prevForm) => {
      const newForm = [...prevForm];
      newForm.splice(index, 1);
      return newForm;
    });
    setCounter((prevCounter) => prevCounter - 1);
  };

  const changeHandler = (event) => {
    const index = fullForm.indexOf(form);

    setForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index][event.target.name].value = event.target.value;
      return newForm;
    });
  };

  /*  const createFormPart = (form) => {
    const JSX = [];

    for (const key in form) {
      if (key === "empty") {
        continue;
      }
      JSX.push(
        <Form.Group controlId={"formBasicName"} key={key}>
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
  }; */

  return (
    <>
      <div className={classes.formBlock}>
        <span className={classes.closeIcon}>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip">Удалить</Tooltip>}
          >
            <i
              className="fa fa-times"
              onClick={
                !form.empty
                  ? hideFormElementHandler
                  : deleteEmptyFormElementHandler
              }
            ></i>
          </OverlayTrigger>
        </span>
        {createFormPart(form, changeHandler)}
      </div>
      <hr />
    </>
  );
};
