import { ToastContainer, Toast } from "react-bootstrap";

export default function Alerts(props) {
  const toastMessages = {
    petFormCompletion: "Please complete your pet's profile.",
    eventFormCompletion: "Make sure you include a start time.",
  };

  return (
    <ToastContainer position="bottom-center" className="margin-tb-sm">
      <Toast
        show={props.showAlert}
        onClose={props.hideAlert}
        delay={3000}
        autohide
      >
        <Toast.Body className="dark small">
          {toastMessages[props.alertKey]}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
