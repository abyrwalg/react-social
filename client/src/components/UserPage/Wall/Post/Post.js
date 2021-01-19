import Card from "react-bootstrap/Card";

import "font-awesome/css/font-awesome.min.css";

import classes from "./Post.module.css";
import avatar from "../../../../../src/assets/images/ava.jpg";

export default function Post(props) {
  const comment = props.comment;
  const postDate = new Date(comment.date);
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  return (
    <Card className={classes.Post}>
      <Card.Body>
        <Card.Title className={classes.postHeader}>
          <img src={avatar} alt="avatar" className={classes.avatar} />
          <span className={classes.userName}>{comment.userName}</span>
          <span className={classes.date}>
            {postDate.toLocaleDateString("ru-RU", dateOptions)}
          </span>
        </Card.Title>
        <Card.Text>{comment.content}</Card.Text>
      </Card.Body>
      <Card.Footer className={classes.postFooter}>
        <i className={`fa fa-heart-o ${classes.like}`}></i>
        <i className={`fa fa-comment-o ${classes.comments}`}></i>
      </Card.Footer>
    </Card>
  );
}
