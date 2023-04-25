import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { BACKEND_URL, USERID } from "../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const [allPost, setAllPost] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPost();
  }, []);
  const getAllPost = async () => {
    const posts = await axios.get(`${BACKEND_URL}/users/${USERID}/posts/`);
    console.log(posts.data);
    setAllPost(posts.data);
  };

  const getAllComments = async () => {
    const comments = await axios.get(`${BACKEND_URL}/users/${USERID}/posts/`);
  };

  const goToPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Note: authenticated users see a summary of pet profiles */}

        {allPost.map((post) => (
          <Card
            style={{ width: "18rem", color: "black", cursor: "pointer" }}
            onClick={() => goToPost(post.id)}
          >
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.content}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </header>
    </div>
  );
}
