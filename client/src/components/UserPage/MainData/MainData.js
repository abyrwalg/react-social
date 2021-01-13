import Card from "react-bootstrap/Card";

import { Career } from "./Career/Career";
import { Education } from "./Education/Education";
import { Header } from "./Header/Header";

import { MainInfo } from "./MainInfo/MainInfo";
import { PersonalData } from "./PersonalData/PersonalData";

const MainData = (props) => {
  return (
    <Card>
      <Card.Body>
        <Header data={props.userData.header} id={props.id} />
        <Card.Text as={"div"}>
          <MainInfo data={props.userData.mainInfo} />
          <Career data={props.userData.career} />
          <Education data={props.userData.education} />
          <PersonalData data={props.userData.personalData} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default MainData;
