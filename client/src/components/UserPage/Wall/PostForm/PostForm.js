import { useState, useContext } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import classes from "./PostForm.module.css";

import { useHttp } from "../../../../hooks/http.hook";
import { AuthContext } from "../../../../context/AuthContext";

export default function PostForm(props) {
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");

  const submitFormHandler = async (event) => {
    event.preventDefault();
    try {
      await request(
        "/api/comments",
        "POST",
        {
          parent: props.id,
          content: commentText,
        },
        { Authorization: `Bearer ${token}` }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const textAreaHandler = (event) => {
    setCommentText(event.target.value);
  };

  return (
    <Form className={classes.PostForm} onSubmit={submitFormHandler}>
      <Form.Group controlId="postForm">
        <Form.Control
          as="textarea"
          placeholder="Напишите что-нибудь"
          className={classes.textArea}
          value={commentText}
          onChange={textAreaHandler}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        className={classes.submitButton}
        disabled={commentText.trim().length > 0 ? false : true}
      >
        Опубликовать
      </Button>
    </Form>
  );
}
