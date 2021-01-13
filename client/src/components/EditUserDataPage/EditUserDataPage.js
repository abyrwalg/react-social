import { useEffect, useState, useContext, useRef } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Alert from "react-bootstrap/Alert";

import { MainData } from "./MainData/MainData";
import { PersonalData } from "./PersonalData/PersonalData";
import Spinner from "../UI/Spinner/Spinner";

import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { Career } from "./Career/Career";
import { Education } from "./Education/Education";

export const EditUserDataPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    variant: "",
    message: "",
    show: false,
  });
  const { uid } = useContext(AuthContext);
  const { request } = useHttp();
  const myRef = useRef(null);

  useEffect(() => {
    document.title = "Редактирование моей страницы";
    async function fetchData() {
      try {
        const data = await request(`/api/user/${uid}`);
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [uid, request]);

  if (loading) {
    return <Spinner />;
  }

  const showAlertHandler = (variant, message) => {
    setAlert({ variant, message, show: true });
  };

  return (
    <Row>
      <Col lg={6} className="m-auto">
        <h1 className="text-center mb-4 h2" ref={myRef}>
          Редактировать страницу
        </h1>
        {alert.show ? (
          <Alert variant={alert.variant}>{alert.message}</Alert>
        ) : null}
        <Tabs defaultActiveKey="main" id="uncontrolled-tab-example">
          <Tab eventKey="main" title="Основное">
            <MainData
              data={{ ...userData.header, ...userData.mainInfo }}
              showAlert={showAlertHandler}
              alertRef={myRef}
            />
          </Tab>
          <Tab eventKey="career" title="Карьера">
            <Career
              data={userData.career}
              showAlert={showAlertHandler}
              alertRef={myRef}
            />
          </Tab>
          <Tab eventKey="education" title="Образование">
            <Education
              data={userData.education}
              showAlert={showAlertHandler}
              alertRef={myRef}
            />
          </Tab>
          <Tab eventKey="personalData" title="Интересы">
            <PersonalData
              data={userData.personalData}
              showAlert={showAlertHandler}
              alertRef={myRef}
            />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};
