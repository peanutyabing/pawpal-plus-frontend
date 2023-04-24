import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, Toast } from "react-bootstrap";
import { AlarmFill } from "react-bootstrap-icons";
import useAxiosPrivate from "../Hooks/useAxiosPrivate.js";

export default function Reminders(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    getReminders();
  }, []);

  const getReminders = async () => {
    try {
      const remindersRes = await axiosPrivate.get("/my-reminders");
      setReminders(remindersRes.data);
    } catch (err) {
      console.log(err);
      navigate("/sign-in", { state: { from: location }, replace: true });
    }
  };

  const displayToasts = () => {
    return reminders.map((reminder, index) => (
      <Toast
        key={reminder.eventId}
        name={index}
        show={reminder.showReminder}
        onClose={() => {
          const remindersToUpdate = [...reminders];
          remindersToUpdate[index].showReminder = false;
          setReminders(remindersToUpdate);
        }}
      >
        <Toast.Header>
          <strong className="me-auto">
            <AlarmFill />
          </strong>
        </Toast.Header>
        <Toast.Body className="dark small">{reminder.content}</Toast.Body>
      </Toast>
    ));
  };

  return (
    <ToastContainer position="top-center" className="margin-tb-sm">
      {displayToasts()}
    </ToastContainer>
  );
}
