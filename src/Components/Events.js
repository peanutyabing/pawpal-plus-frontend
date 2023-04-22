import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL, USERID } from "../Constants.js";
import { calculateAge, calculateDuration, sortEventsByDay } from "../Utils.js";
import { Accordion, Badge } from "react-bootstrap";
import { PlusCircleFill, ArrowLeftShort } from "react-bootstrap-icons";
import useAuth from "../Hooks/useAuth.js";

export default function Events() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [petProfile, setPetProfile] = useState({});
  const [petEvents, setPetEvents] = useState([]);

  useEffect(() => {
    retrievePetProfile();
  }, []);

  const retrievePetProfile = async () => {
    const profile = await axios.get(
      `${BACKEND_URL}/users/${USERID}/pets/${petId}`,
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    setPetProfile(profile.data[0]);
  };

  useEffect(() => {
    retrievePetEvents();
  }, []);

  const retrievePetEvents = async () => {
    const events = await axios.get(
      `${BACKEND_URL}/users/${USERID}/pets/${petId}/events`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    setPetEvents(events.data);
  };

  const displayProfile = () => {
    if (!petProfile) {
      return;
    }
    return (
      <div className="flex-container margin-tb-m">
        <img
          className="profile-sm margin-lr-m"
          src={petProfile.imageUrl}
          alt={petProfile.name}
        />
        <div className="margin-lr-m">
          <div className="large bold">{petProfile.name}</div>
          <div className="medium">{calculateAge(petProfile.dateOfBirth)}</div>
        </div>
      </div>
    );
  };

  const displayEvents = () => {
    if (!petEvents) {
      return;
    } else if (petEvents.length === 0) {
      return <div>{petProfile.name} doesn't have any activities yet!</div>;
    } else {
      const bgVariants = [
        "primary",
        "warning",
        "secondary",
        "dark",
        "success",
        "danger",
        "info",
      ];
      const eventsByDay = sortEventsByDay(petEvents);
      const eventsList = [];
      let counter = 0;
      for (const day in eventsByDay) {
        const dayEventsList = [];
        for (const event of eventsByDay[day]) {
          dayEventsList.push(
            <div className="event-item flex-container-space-btw" key={event.id}>
              <div className="small margin-lr-sm">
                {event.subcategory.name} ({calculateDuration(event)})
              </div>
              <Badge
                className="small margin-lr-sm"
                bg={bgVariants[event.categoryId - 1]}
                text={event.categoryId === 2 && "dark"}
              >
                {event.category.name}
              </Badge>
            </div>
          );
        }
        eventsList.push(
          <Accordion.Item key={day} eventKey={counter}>
            <Accordion.Header>{day}</Accordion.Header>
            <Accordion.Body className="day-events-container">
              {dayEventsList}
            </Accordion.Body>
          </Accordion.Item>
        );
        counter++;
      }
      return (
        <Accordion
          className="events-container"
          flush
          alwaysOpen
          defaultActiveKey={[0]}
        >
          {eventsList}
        </Accordion>
      );
    }
  };

  return (
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
      {displayProfile()}
      {displayEvents()}
      <div className="bottom-btn-container">
        <PlusCircleFill
          className="custom-btn"
          onClick={() => {
            navigate("./add-activity");
          }}
        />
      </div>
    </header>
  );
}
