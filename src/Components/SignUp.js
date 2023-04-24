import { useState } from "react";
import useAuth from "../Hooks/useAuth.js";
import { useNavigate, Link } from "react-router-dom";
import { axiosDefault } from "../Axios.js";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { ExclamationTriangleFill, Check2All } from "react-bootstrap-icons";
import PasswordStrengthBar from "react-password-strength-bar";
import Alerts from "./Alerts.js";

export default function SignUp() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [newUserProfile, setNewUserProfile] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [duplicatedUser, setDuplicatedUser] = useState({
    username: false,
    email: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertKey, setAlertKey] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;
    setNewUserProfile((prevState) => ({ ...prevState, [name]: value }));
  };

  const checkIfUnique = async (attributeName, attributeValue) => {
    const response = await axiosDefault.post("/user-profile/check-if-exist", {
      [attributeName]: attributeValue,
    });
    setDuplicatedUser((prevState) => ({
      ...prevState,
      [attributeName]: response?.data?.userFound,
    }));
  };

  const signUp = async (e) => {
    e.preventDefault();
    if (
      !newUserProfile.username ||
      !newUserProfile.email ||
      !newUserProfile.password ||
      duplicatedUser.username ||
      duplicatedUser.email ||
      newUserProfile.password !== confirmPassword
    ) {
      setShowAlert(true);
      setAlertKey("signUpError");
      return;
    }
    try {
      const signUpRes = await axiosDefault.post(
        "/auth/sign-up",
        newUserProfile,
        { withCredentials: true }
      );
      const { token } = signUpRes.data;
      setAuth({ token });
      localStorage.setItem("createdAccount", true);
      navigate("/update-profile");
    } catch (err) {
      console.log(err);
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="large bold">Welcome</h1>
        <h2 className="small">
          Already have an account?{" "}
          <Link to="/account/sign-in" className="small">
            Sign in
          </Link>
        </h2>
        <Form className="margin-lr-m" onSubmit={signUp}>
          <Form.Group className="margin-tb-m">
            <FloatingLabel label="Username" className="dark">
              <Form.Control
                name="username"
                type="text"
                value={newUserProfile.username}
                onChange={(e) => {
                  handleChange(e);
                  checkIfUnique("username", e.target.value);
                }}
                placeholder="new-user"
                autoFocus
              />
            </FloatingLabel>
            {!newUserProfile.username && (
              <div className="small">
                <ExclamationTriangleFill /> Please enter a username
              </div>
            )}
            {duplicatedUser.username && (
              <div className="small">
                <ExclamationTriangleFill /> This username already exists
              </div>
            )}
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel label="Email" className="dark">
              <Form.Control
                name="email"
                type="email"
                value={newUserProfile.email}
                onChange={(e) => {
                  handleChange(e);
                  checkIfUnique("email", e.target.value);
                }}
                placeholder="my@email.com"
              />
            </FloatingLabel>
            {!newUserProfile.email.includes("@" && ".") && (
              <div className="small">
                <ExclamationTriangleFill /> Please enter a valid email
              </div>
            )}
            {duplicatedUser.email && (
              <div className="small">
                <ExclamationTriangleFill /> This email already exists
              </div>
            )}
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel label="Password" className="dark">
              <Form.Control
                name="password"
                type="password"
                value={newUserProfile.password}
                placeholder="12345"
                onChange={handleChange}
              />
            </FloatingLabel>
            <PasswordStrengthBar
              password={newUserProfile.password}
              scoreWordStyle={{ color: "#ffffff", textAlign: "center" }}
            />
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel label="Confirm password" className="dark">
              <Form.Control
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                placeholder="12345"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </FloatingLabel>
            {newUserProfile.password !== confirmPassword ? (
              <div className="small">
                <ExclamationTriangleFill /> Passwords do not match
              </div>
            ) : (
              <div className="small">
                <Check2All /> Passwords match
              </div>
            )}
          </Form.Group>
          <Form.Group className="margin-tb-l">
            <Button variant="light" type="submit" size="sm">
              Sign up
            </Button>
          </Form.Group>
        </Form>
        <Alerts
          showAlert={showAlert}
          hideAlert={() => {
            setShowAlert(false);
          }}
          alertKey={alertKey}
        />
      </header>
    </div>
  );
}
