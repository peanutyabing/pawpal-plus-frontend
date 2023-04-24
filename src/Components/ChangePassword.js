import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../Hooks/useAxiosPrivate.js";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { ExclamationTriangleFill, Check2All } from "react-bootstrap-icons";
import PasswordStrengthBar from "react-password-strength-bar";
import Alerts from "./Alerts.js";

export default function ChangePassword() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertKey, setAlertKey] = useState("");

  const changePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword || newPassword.length < 8) {
      setShowAlert(true);
      setAlertKey("passwordChangeError");
      return;
    }
    try {
      await axiosPrivate.put(
        "/auth/change-password",
        { password: newPassword },
        { withCredentials: true }
      );
      setShowAlert(true);
      setAlertKey("passwordChangeSuccess");
      setTimeout(() => {
        navigate("/account");
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="large bold">Change password</h1>
        <Form className="margin-lr-m" onSubmit={changePassword}>
          <Form.Group className="margin-tb-m">
            <FloatingLabel label="New password" className="dark">
              <Form.Control
                type="password"
                value={newPassword}
                placeholder="12345"
                autoFocus
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </FloatingLabel>
            <PasswordStrengthBar
              password={newPassword}
              scoreWordStyle={{ color: "#ffffff", textAlign: "center" }}
            />
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel label="Confirm password" className="dark">
              <Form.Control
                type="password"
                value={confirmNewPassword}
                placeholder="12345"
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                }}
              />
            </FloatingLabel>
            {newPassword !== confirmNewPassword ? (
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
              Confirm
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
