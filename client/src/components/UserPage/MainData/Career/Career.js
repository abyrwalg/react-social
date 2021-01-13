import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import classes from "./Career.module.css";

export const Career = (props) => {
  if (props.data.length === 0) {
    return <></>;
  }

  props.data.sort((a, b) => b.yearStart - a.yearStart);

  const careerJSX = props.data.map((job) => {
    let jobYearsString = "";
    if (job.yearStart && job.yearEnd) {
      jobYearsString = `с ${job.yearStart} по ${job.yearEnd} г.`;
    } else if (job.yearStart) {
      jobYearsString = `с ${job.yearStart} г.`;
    } else if (job.yearEnd) {
      jobYearsString = `до ${job.yearEnd} г.`;
    }

    return (
      <Row key={job.workplace + job.yearStart}>
        <Col lg={4}>
          <p className="text-muted mb-0">Место работы: </p>
        </Col>
        <Col lg={8}>
          <p className="mb-2">
            <span>{job.workplace}</span>
            <span>{job.city}</span>
            <span>{job.position}</span>
            {jobYearsString && <span>{jobYearsString}</span>}
          </p>
        </Col>
      </Row>
    );
  });
  return (
    <>
      <hr />
      <div className={classes.Career}>
        <h2 className="h5 mb-3">Карьера</h2>
        {careerJSX}
      </div>
    </>
  );
};
