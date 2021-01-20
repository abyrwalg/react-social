import { useState, useContext, useRef, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import classes from "./PostForm.module.css";

import { useHttp } from "../../../../hooks/http.hook";
import { AuthContext } from "../../../../context/AuthContext";

export default function PostForm(props) {
  const { request, loading } = useHttp();
  const { token } = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(100);
  const textareaRef = useRef(null);

  useEffect(() => {
    setTextareaHeight(textareaRef.current.scrollHeight);
  }, [commentText]);

  const submitFormHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(loading);
      setCommentText("");
      const data = await request(
        "/api/comments",
        "POST",
        {
          parent: props.id,
          content: commentText,
        },
        { Authorization: `Bearer ${token}` }
      );
      console.log(loading);
      props.setComments([data.comment, ...props.comments]);
    } catch (error) {
      console.log(error);
    }
  };

  const textAreaChangeHandler = (event) => {
    setCommentText(event.target.value);
    setTextareaHeight(0);
  };

  return (
    <Form className={classes.PostForm} onSubmit={submitFormHandler}>
      <Form.Group controlId="postForm">
        <Form.Control
          as="textarea"
          placeholder="Напишите что-нибудь"
          className={classes.textArea}
          value={commentText}
          onChange={textAreaChangeHandler}
          ref={textareaRef}
          style={{ height: textareaHeight }}
          rows={3}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        className={classes.submitButton}
        disabled={(commentText.trim().length > 0 ? false : true) || loading}
      >
        Опубликовать
      </Button>
    </Form>
  );
}
