import { useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { axiosDefault } from "../Axios.js";
import { Form, FloatingLabel, Button } from "react-bootstrap";

export default function SignIn() {
  const { setAuth, trustDevice, setTrustDevice } = useAuth();
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

  const toggleTrustDevice = () => {
    setTrustDevice((prevState) => !prevState);
  };

  useEffect(() => {
    localStorage.setItem("trustDevice", trustDevice);
  }, [trustDevice]);

  const signIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please provide your email and password!");
    }
    try {
      const signInRes = await axiosDefault.post(
        "/auth/sign-in",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      const { token } = signInRes.data;
      setAuth({ token });
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
        <h1 className="large bold">Welcome back</h1>
        <h2 className="small">
          First time here?{" "}
          <Link to="/sign-up" className="small">
            Sign up
          </Link>
        </h2>
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
            <Form.Check
              type="switch"
              name="trustDevice"
              label="Trust this device"
              checked={trustDevice}
              onChange={toggleTrustDevice}
            />
          </Form.Group>
          <Form.Group className="margin-tb-l">
            <Button variant="light" type="submit" size="sm">
              Log in
            </Button>
          </Form.Group>
        </Form>
      </header>
    </div>
  );
}
