import { useContext, useState, useEffect, useRef, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { AuthContext } from "../../../../context/AuthContext";
import { useHttp } from "../../../../hooks/http.hook";
import classes from "./Header.module.css";

export const Header = (props) => {
  const { uid, token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const statusFormRef = useRef(null);
  const statusInputRef = useRef(null);
  const allowStatusChange = uid === +props.id;
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [prevStatus, setPrevStatus] = useState(props.data.status);
  const [status, setStatus] = useState(props.data.status);
  const [buttonState, setButtonState] = useState("Отмена");

  useEffect(() => {
    if (statusInputRef.current !== null) {
      statusInputRef.current.focus();
    }
  }, [showStatusForm]);

  useEffect(() => {
    if (status === prevStatus) {
      setButtonState("Отмена");
    } else {
      setButtonState("Изменить");
    }
  }, [prevStatus, status]);

  useEffect(() => {
    setStatus(props.data.status);
  }, [props.data.status]);

  const editStatusHandler = () => {
    if (!allowStatusChange) {
      return;
    }
    setShowStatusForm(true);
  };

  const changeStatusHandler = (event) => {
    setStatus(event.target.value);
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    if (buttonState === "Отмена") {
      setShowStatusForm(false);
    } else if (buttonState === "Изменить") {
      const updateStatus = { status };
      try {
        await request("/api/user/status", "PATCH", updateStatus, {
          Authorization: `Bearer ${token}`,
        });
        setShowStatusForm(false);
        setPrevStatus(status);
      } catch (error) {
        console.log(error);
      }
    }
  };

  let statusJSX = (
    <span>
      {status ? (
        <span
          className={allowStatusChange && classes.canChange}
          onClick={editStatusHandler}
        >
          {status}
        </span>
      ) : (
        allowStatusChange && (
          <span
            className={`${classes.changeStatus} ${classes.canChange}`}
            onClick={editStatusHandler}
          >
            изменить статус
          </span>
        )
      )}
    </span>
  );

  if (showStatusForm) {
    statusJSX = (
      <form
        className={classes.statusForm}
        onSubmit={submitFormHandler}
        ref={statusFormRef}
      >
        <Form.Label htmlFor="inlineFormInputName2" srOnly>
          Статус
        </Form.Label>
        <Form.Control
          className="mb-2 mr-sm-2"
          id="inlineFormInputName2"
          placeholder="Введите статус"
          value={status}
          onChange={changeStatusHandler}
          ref={statusInputRef}
          maxLength={120}
        />

        <Button type="submit" className="mb-2" disabled={loading}>
          {buttonState}
        </Button>
      </form>
    );
  }

  const clickHandler = useCallback(
    (event) => {
      if (!statusFormRef.current) {
        return;
      }

      if (
        !statusFormRef.current.contains(event.target) &&
        !event.target.classList.contains(classes.canChange)
      ) {
        setShowStatusForm(false);
        setStatus(prevStatus);
      }
    },
    [prevStatus]
  );

  useEffect(() => {
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [clickHandler]);

  return (
    <>
      <Card.Title className="pb-2">
        {props.data.name + " " + props.data.surname}
      </Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        {statusJSX}
        <hr />
      </Card.Subtitle>
    </>
  );
};
