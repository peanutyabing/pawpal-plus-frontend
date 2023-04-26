import { useState, useEffect } from "react";
import { BACKEND_URL, USERID } from "../Constants";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

export default function Posts() {
  const [postDetails, setPostDetails] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [content, setNewContent] = useState("");
  let { postId } = useParams();

  useEffect(() => {
    getSinglePost();
    getAllComments();
  }, []);

  useEffect(() => {
    console.log(content);
  }, [content]);

  const getSinglePost = async () => {
    const posts = await axios.get(
      `${BACKEND_URL}/users/${USERID}/posts/postId/${postId}`
    );
    console.log(posts.data);
    setPostDetails(posts.data);
  };

  const getAllComments = async () => {
    const comments = await axios.get(
      `${BACKEND_URL}/users/${USERID}/posts/postId/${postId}/comments`
    );
    setAllComments(comments.data);
  };

  const handleChange = (e) => {
    setNewContent(e.target.value);
  };

  const addComment = async (e) => {
    e.preventDefault();
    await axios
      .post(`${BACKEND_URL}/users/${USERID}/posts/${postId}/addComments`, {
        content,
      })
      .then(getAllComments())
      .then(changeList());
  };

  let listOfComments = (
    <div>
      comments:
      {allComments.map((comments) => (
        <div class="media">
          <div class="media-body">
            <p>
              user {comments.userId} : {comments.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
  const changeList = () => {
    listOfComments = (
      <div>
        {allComments.map((comments) => (
          <Card style={{ width: "18rem", color: "black", cursor: "pointer" }}>
            <Card.Body>
              <Card.Title>{comments.content}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };
  return (
    <div className="App">
      <header className="App-header">
        {/* Note: authenticated users see a summary of pet profiles */}
        <p>Title : {postDetails.title}</p>
        <p>content : {postDetails.content}</p>

        <div>
          {listOfComments}
          {/* {allComments.map((comments) => (
            <Card style={{ width: "18rem", color: "black", cursor: "pointer" }}>
              <Card.Body>
                <Card.Title>{comments.content}</Card.Title>
              </Card.Body>
            </Card>
          ))} */}
        </div>
        <Form onSubmit={addComment}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control onChange={handleChange} placeholder="Enter comment" />{" "}
            <Button variant="primary" type="submit">
              Comment
            </Button>
          </Form.Group>
        </Form>
      </header>
    </div>
  );
}
