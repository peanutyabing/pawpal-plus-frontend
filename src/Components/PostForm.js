import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../Firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Form, FloatingLabel, Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import { ArrowLeftShort } from "react-bootstrap-icons";

import { BACKEND_URL, USERID } from "../Constants";

import axios from "axios";

export default function PostForm() {
  const navigate = useNavigate();

  const [topicsList, setTopicsList] = useState([]);
  const [post, setPost] = useState({
    userId: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    getTopics();
  }, []);

  const addPost = async (e) => {
    e.preventDefault();
    await axios
      .post(`${BACKEND_URL}/users/${USERID}/posts`, post)
      .then(navigate("/posts"));
  };

  const getTopics = async () => {
    try {
      /* 
      const topics = await axiosDefault.get("/users/2/posts/topics/all"); */
      const topics = await axios.get(`${BACKEND_URL}/users/2/posts/topics/all`);
      setTopicsList(topics.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const postToUpdate = { ...post };
    postToUpdate[e.target.name] = e.target.value;
    setPost(postToUpdate);
  };

  const handleSelect = (selected) => {
    const postToUpdate = { ...post };
    postToUpdate[selected.name] = selected.value;
    setPost(postToUpdate);
  };
  return (
    <div className="App">
      <header className="App-header">
        <div
          className="top-btn-container bold"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftShort />
          Back
        </div>
        <h1 className="x-large">New post</h1>
        <Form className="margin-lr-m" onSubmit={addPost}>
          <Form.Group className="margin-tb-m">
            <Form.Control
              name="title"
              type="text"
              value={post.title}
              onChange={handleChange}
              placeholder="Title"
            />
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <Form.Control
              name="content"
              type="text"
              value={post.content}
              onChange={handleChange}
              placeholder="Content"
            />
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="What topic is your post?"
              isSearchable={true}
              options={topicsList.map((topics) => {
                return {
                  value: topics.id,
                  label: topics.name,
                  name: "topicId",
                };
              })}
              onChange={handleSelect}
              styles={{
                option: (provided) => ({
                  ...provided,
                  color: "#222831",
                }),
              }}
            />
          </Form.Group>

          <Form.Group className="margin-tb-m">
            <Button type="submit" size="sm" variant="light">
              Submit
            </Button>
          </Form.Group>
        </Form>
      </header>
    </div>
  );
}
