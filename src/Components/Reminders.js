import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, Toast } from "react-bootstrap";
import { AlarmFill } from "react-bootstrap-icons";
import { BACKEND_URL, USERID } from "../Constants.js";

export default function Reminders(props) {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    getReminders();
  }, []);

  const getReminders = async () => {
    const remindersRes = await axios.get(
      `${BACKEND_URL}/users/${USERID}/reminders`
    );
    setReminders(remindersRes.data);
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
