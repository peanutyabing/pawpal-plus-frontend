import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL, USERID } from "../Constants.js";
import { calculateAge, calculateDuration, sortEventsByDay } from "../Utils.js";

export default function Events() {
  const { petId } = useParams();

  const [petProfile, setPetProfile] = useState({});

  useEffect(() => {
    retrievePetProfile();
  }, []);

  const retrievePetProfile = async () => {
    const profile = await axios.get(
      `${BACKEND_URL}/users/${USERID}/pets/${petId}`
    );
    setPetProfile(profile.data[0]);
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
    if (!petProfile.events) {
      return;
    } else if (petProfile.events.length === 0) {
      return (
        <div className="events-container">
          {petProfile.name} doesn't have any activities yet!
        </div>
      );
    } else {
      const output = [];
      const sortedEvents = sortEventsByDay(petProfile.events);
      for (const key in sortedEvents) {
        const eventsOfDay = [
          <div className="bold small" key={key}>
            {key}
          </div>,
        ];
        for (const event of sortedEvents[key]) {
          eventsOfDay.push(
            <div key={event.id} className="flex-container">
              <div className="small margin-lr-sm">{event.name}</div>
              <div className="small margin-lr-sm">
                {calculateDuration(event)}
              </div>
            </div>
          );
        }
        output.push(
          <div className="margin-tb-m events-container" key={key}>
            {eventsOfDay}
          </div>
        );
      }
      return <div className="events-container">{output}</div>;
    }
  };

  return (
    <header className="App-header">
      {displayProfile()}
      {displayEvents()}
    </header>
  );
}
