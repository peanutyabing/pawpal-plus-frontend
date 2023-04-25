import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  calculateAge,
  getNextBirthday,
  calculateDuration,
  sortEventsByDay,
  defaultPetPhoto,
} from "../Utils.js";
import { Accordion, Badge } from "react-bootstrap";
import {
  PlusCircleFill,
  ArrowLeftShort,
  CalendarEvent,
} from "react-bootstrap-icons";
import CurlyArrow from "../Images/Curly-arrow.png";
import useAxiosPrivate from "../Hooks/useAxiosPrivate.js";

export default function Events() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [petProfile, setPetProfile] = useState({});
  const [petEvents, setPetEvents] = useState([]);

  useEffect(() => {
    retrievePetProfile();
  }, []);

  const retrievePetProfile = async () => {
    try {
      const profile = await axiosPrivate.get(`/my-pets/${petId}`);
      setPetProfile(profile.data[0]);
    } catch (err) {
      console.log(err);
      navigate("/account/sign-in", {
        state: { from: location },
        replace: true,
      });
    }
  };

  useEffect(() => {
    retrievePetEvents();
  }, []);

  const retrievePetEvents = async () => {
    try {
      const events = await axiosPrivate.get(`/my-pets/${petId}/events`);
      setPetEvents(events.data);
    } catch (err) {
      console.log(err);
      navigate("/account/sign-in", {
        state: { from: location },
        replace: true,
      });
    }
  };

  const displayProfile = () => {
    if (!petProfile) {
      return;
    }
    return (
      <div className="flex-container margin-tb-m profile">
        <img
          className="profile-sm margin-lr-m"
          src={petProfile?.imageUrl || defaultPetPhoto}
          alt={petProfile?.name}
        />
        <div className="margin-lr-m">
          <div className="large bold">{petProfile?.name}</div>
          <div className="medium">
            {petProfile?.species?.name} | {petProfile?.breed?.name}
          </div>
          <div className="medium flex-container">
            <CalendarEvent />
            <div className="margin-lr-m">
              {getNextBirthday(petProfile?.dateOfBirth)} (
              {calculateAge(petProfile?.dateOfBirth)})
            </div>
          </div>
        </div>
      </div>
    );
  };

  const displayEvents = () => {
    if (!petEvents) {
      return;
    } else if (petEvents.length === 0) {
      return (
        <div className="hint">
          <div className="large bold">
            {petProfile.name} doesn't have activities yet! <br /> Add one here
          </div>
          <img
            className="guide-arrow"
            src={CurlyArrow}
            alt="Add an event using the + button"
          />
        </div>
      );
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
