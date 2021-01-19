import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export const PersonalData = (props) => {
  let isEmpty = true;

  for (const key in props.data) {
    if (props.data[key].length > 0) {
      isEmpty = false;
      break;
    }
  }

  if (isEmpty) {
    return <></>;
  }

  const fillWithData = (name, data) => {
    return (
      <Row>
        <Col lg={4}>
          <p className="text-muted mb-0">{name}: </p>
        </Col>
        <Col lg={8}>
          <p className="mb-2">{data}</p>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <hr />
      <div>
        <h2 className="h5 mb-3">Личная информация</h2>
        {props.data.interests !== ""
          ? fillWithData("Интересы", props.data.interests)
          : null}
        {props.data.favoriteBooks !== ""
          ? fillWithData("Любимые книги", props.data.favoriteBooks)
          : null}
        {props.data.favoriteMovies !== ""
          ? fillWithData("Любимые фильмы", props.data.favoriteMovies)
          : null}
        {props.data.favoriteMusic !== ""
          ? fillWithData("Любимая музыка", props.data.favoriteMusic)
          : null}
        {props.data.about ? (
          <Row>
            <Col lg={4}>
              <p className="text-muted mb-0">О себе: </p>
            </Col>
            <Col lg={8}>
              <p className="mb-2">{props.data.about}</p>
            </Col>
          </Row>
        ) : null}
      </div>
    </>
  );
};
