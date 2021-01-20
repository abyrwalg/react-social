import { useContext, useState, useEffect, useRef } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";

import { Link } from "react-router-dom";

import "font-awesome/css/font-awesome.min.css";

import classes from "./Post.module.css";

import DropdownMenuButton from "./DropdownMenuButton/DropdownMenuButton";

import { useHttp } from "../../../../hooks/http.hook";
import { AuthContext } from "../../../../context/AuthContext";

export default function Post(props) {
  const comment = props.comment;
  const postDate = new Date(comment.date);
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const avatarPath = comment.avatar.replace(/\\/g, "/");
  const [showEditArea, setShowEditArea] = useState(false);
  const [editAreaContent, setEditAreaContent] = useState(comment.content);
  const [editAreaHeight, setEditAreaHeight] = useState(0);
  const editAreaRef = useRef(null);
  const { request, loading } = useHttp();
  const { token, id } = useContext(AuthContext);

  const [hideDropdownMenuClass, setHideDropdownMenuClass] = useState("");
  let hideEdiCommentButtonClass = "";

  useEffect(() => {
    if (comment.parent !== id && comment.author !== id) {
      setHideDropdownMenuClass(classes.hide);
    }
  }, [comment.author, comment.parent, id]);

  if (comment.author !== id) {
    hideEdiCommentButtonClass = classes.hide;
  }

  useEffect(() => {
    setEditAreaHeight(editAreaRef.current.scrollHeight);
  }, [editAreaContent]);

  const deletePostHandler = async () => {
    try {
      await request(
        "/api/comments",
        "DELETE",
        { ...comment },
        { Authorization: `Bearer ${token}` }
      );
      const comments = props.comments.filter(
        (element) => element._id !== comment._id
      );
      props.setComments(comments);
    } catch (error) {
      console.log(error);
    }
  };

  const editAreaChangeHandler = (event) => {
    setEditAreaContent(event.target.value);
    setEditAreaHeight(0);
  };

  const showEditPostHandler = () => {
    setShowEditArea(true);

    setTimeout(() => {
      editAreaRef.current.focus();
      setEditAreaHeight(editAreaRef.current.scrollHeight);
      editAreaRef.current.selectionStart = editAreaRef.current.value.length;
      editAreaRef.current.selectionEnd = editAreaRef.current.value.length;
    }, 10);
    setHideDropdownMenuClass(classes.hide);
  };

  const hideEditPostHandler = () => {
    setShowEditArea(false);
    setEditAreaContent(comment.content);
    setHideDropdownMenuClass("");
  };

  const submitEditedPostHandler = async () => {
    try {
      await request(
        "/api/comments",
        "PUT",
        { ...comment, content: editAreaContent },
        { Authorization: `Bearer ${token}` }
      );
      const comments = [...props.comments];
      const commentIndex = props.comments.indexOf(comment);
      comments[commentIndex] = {
        ...comments[commentIndex],
        content: editAreaContent,
      };
      hideEditPostHandler();
      props.setComments(comments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className={classes.Post}>
      <Card.Body>
        <Card.Title className={classes.postHeader}>
          <Link to={`/users/${comment.uid}`}>
            <div
              style={{ backgroundImage: `url(/${avatarPath})` }}
              className={classes.avatar}
            ></div>
          </Link>
          <Link className={classes.userName} to={`/users/${comment.uid}`}>
            {comment.userName}
          </Link>
          <span className={classes.date}>
            {postDate.toLocaleDateString("ru-RU", dateOptions)}
          </span>
          <Dropdown
            className={`${classes.dropDownButton} ${hideDropdownMenuClass}`}
          >
            <Dropdown.Toggle as={DropdownMenuButton}></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={deletePostHandler}>Удалить</Dropdown.Item>
              <Dropdown.Item
                onClick={showEditPostHandler}
                className={hideEdiCommentButtonClass}
              >
                Редактировать
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Title>
        <Card.Text as="div">
          <Form
            className={`${classes.editComment} ${
              !showEditArea ? classes.hide : null
            }`}
          >
            <Form.Control
              as="textarea"
              value={editAreaContent}
              onChange={editAreaChangeHandler}
              ref={editAreaRef}
              style={{ height: editAreaHeight }}
            />
            <div className={classes.editCommentButtons}>
              <Button variant="secondary" onClick={hideEditPostHandler}>
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={submitEditedPostHandler}
                disabled={loading}
              >
                Сохранить
              </Button>
            </div>
          </Form>
          <div className={showEditArea ? classes.hide : null}>
            {comment.content}
          </div>
        </Card.Text>
      </Card.Body>
      <Card.Footer className={classes.postFooter}>
        <i className={`fa fa-heart-o ${classes.like}`}></i>
        <i className={`fa fa-comment-o ${classes.comments}`}></i>
      </Card.Footer>
    </Card>
  );
}
