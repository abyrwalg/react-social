import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
//import Form from "react-bootstrap/Form";

import classes from "./HigherElem.module.css";
import { createFormPart } from "../../../../../utils/utils";

export const HigherElem = (props) => {
  const { form, setForm, fullForm, setCounter } = props;

  const changeHandler = (event) => {
    const index = fullForm.indexOf(form);

    setForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index][event.target.name].value = event.target.value;
      return newForm;
    });
  };

  const hideFormElementHandler = () => {
    const index = fullForm.indexOf(form);
    setForm((prevForm) => {
      const newForm = [...prevForm];
      newForm[index].removed = true;
      console.log(newForm);
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
        {/*  <Form.Group controlId={"formBasicName"}>
          <Form.Label>Вуз</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Укажите название вуза"
            value={form.name.value}
            onChange={changeHandler}
            isInvalid={form.name.isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {form.name.errorMessage}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId={"formBasicSpecialty"}>
          <Form.Label>Специальность</Form.Label>
          <Form.Control
            type="text"
            name="specialty"
            placeholder="Укажите специальность"
            value={form.specialty.value}
            onChange={changeHandler}
            isInvalid={form.specialty.isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {form.specialty.errorMessage}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId={"formBasicStatus"}>
          <Form.Label>Статус</Form.Label>
          <Form.Control
            type="text"
            name="status"
            placeholder="Укажите статус (например, студент)"
            value={form.status.value}
            onChange={changeHandler}
            isInvalid={form.status.isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {form.status.errorMessage}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId={"formBasicYearStart"}>
          <Form.Label>Год начала обучения</Form.Label>
          <Form.Control
            type="text"
            name="yearStart"
            placeholder="Укажите год начала обучения"
            value={form.yearStart.value}
            onChange={changeHandler}
            isInvalid={form.yearStart.isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {form.yearStart.errorMessage}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId={"formBasicYearEnd"}>
          <Form.Label>Год окончания обучения</Form.Label>
          <Form.Control
            type="text"
            name="yearEnd"
            placeholder="Укажите год окончания обучения"
            value={form.yearEnd.value}
            onChange={changeHandler}
            isInvalid={form.yearEnd.isInvalid}
          />
          <Form.Control.Feedback type="invalid">
            {form.yearEnd.errorMessage}
          </Form.Control.Feedback>
        </Form.Group> */}
      </div>
      <hr />
    </>
  );
};
