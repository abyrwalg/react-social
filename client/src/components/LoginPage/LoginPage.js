import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import { createForm, validateForm } from "../../utils/utils";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: {
      value: "",
      type: "email",
      label: "Email",
      placeholder: "Введите email",
      validation: {
        required: true,
        type: "email",
      },
      isInvalid: false,
      errorMessage: null,
    },
    password: {
      value: "",
      type: "password",
      label: "Пароль",
      placeholder: "Введите пароль",
      validation: {
        required: true,
      },
      isInvalid: false,
      errorMessage: null,
    },
  });

  const [alert, setAlert] = useState({
    variant: "",
    message: "",
    show: false,
  });

  const { login } = useContext(AuthContext);
  const { request, loading } = useHttp();

  const formSubmitHandler = async (event, form, setForm, url) => {
    event.preventDefault();
    const isValid = validateForm(form, setForm);

    if (isValid) {
      const clearedFormData = {};

      for (const key in form) {
        clearedFormData[key] = form[key].value;
      }

      try {
        const data = await request(url, "POST", clearedFormData);
        console.log(data);
        if (data.token) {
          login(data.token, data.id, data.uid, data.expires, data.name);
        }
      } catch (error) {
        setAlert({ variant: "danger", message: error.message, show: true });

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
            <Card.Title style={{ textAlign: "center" }}>
              Добро пожаловать!
            </Card.Title>
            <Form
              noValidate
              onSubmit={(event) =>
                formSubmitHandler(event, form, setForm, "api/auth/login")
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
              style={{ textAlign: "center" }}
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
