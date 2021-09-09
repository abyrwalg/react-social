import React, { useEffect, useState } from 'react';

import Card from 'react-bootstrap/Card';

import PostForm from './PostForm/PostForm';
import Post from './Post/Post';

import classes from './Wall.module.css';
import { useHttp } from '../../../hooks/http.hook';
import { hasAuthData } from '../../../helpers/authStorage';

const Wall = (props) => {
  const { id } = props;
  const { request } = useHttp();
  const isAuthenticated = hasAuthData();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await request(`/api/comments/${id}`, 'GET');
        setComments(data.comments);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id, request]);

  let componentContent = (
    <Card className={classes.Wall}>
      <Card.Body className={classes.cardBody}>
        {isAuthenticated ? (
          <PostForm id={id} setComments={setComments} comments={comments} />
        ) : null}
        {comments.map((comment) => (
          <Post
            comment={comment}
            key={comment._id}
            comments={comments}
            setComments={setComments}
          />
        ))}
      </Card.Body>
    </Card>
  );

  if (!isAuthenticated && comments.length === 0) {
    componentContent = null;
  }

  return componentContent;
};

export default Wall;
