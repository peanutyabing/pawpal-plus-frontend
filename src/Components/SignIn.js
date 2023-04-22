import { useState } from "react";
import useAuth from "../Hooks/useAuth.js";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { BACKEND_URL } from "../Constants.js";
import { Form, FloatingLabel, Button } from "react-bootstrap";

export default function SignIn() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please provide your email and password!");
    }
    try {
      const signInRes = await axios.post(
        `${BACKEND_URL}/auth/sign-in`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      const { token, refreshToken } = signInRes.data;
      const profile = await axios.get(`${BACKEND_URL}/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuth({ ...profile.data, token, refreshToken });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true }); // Navigate to where the user was before they were redirected to sign-in
    } catch (err) {
      console.log(err);
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="large bold">Log in</h1>
        <Form className="margin-lr-m" onSubmit={signIn}>
          <Form.Group className="margin-tb-m">
            <FloatingLabel label="Email" className="dark">
              <Form.Control
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="my@email.com"
                autoFocus
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel label="Password" className="dark">
              <Form.Control
                name="password"
                type="password"
                value={password}
                placeholder="12345"
                onChange={handleChange}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <Button variant="light" type="submit">
              Log in
            </Button>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            Need an account? <Link to="/">Sign up</Link>
          </Form.Group>
        </Form>
      </header>
    </div>
  );
}
