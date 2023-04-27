import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../Hooks/useAxiosPrivate";
import {
  ArrowLeftShort,
  Calendar2Event,
  ExclamationCircleFill,
  Speedometer2,
} from "react-bootstrap-icons";
import { defaultPetPhoto, calculateDuration } from "../Utils.js";
import moment from "moment";

export default function EventDetails() {
  const { petId, eventId } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [event, setEvent] = useState({});

  useEffect(() => {
    getEvent();
  }, []);

  const getEvent = async () => {
    const event = await axiosPrivate.get(`/my-pets/${petId}/events/${eventId}`);
    setEvent(event.data);
  };

  return (
    <div className="App">
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
        <div className="flex-container margin-tb-m">
          <img
            className="profile-xs margin-lr-m"
            src={event.pet?.imageUrl || defaultPetPhoto}
            alt={event.pet?.name}
          />
          <div className="large">{event.pet?.name}'s activity</div>
        </div>
        <div className="margin-tb-m">
          <div>
            {event.category?.name} | {event.subcategory?.name}
          </div>
        </div>
        <div className="margin-tb-m">
          <div className="flex-container">
            <Calendar2Event className="margin-lr-m" />
            <div>
              {moment(new Date(event.startTime)).format("MMMM Do YYYY, h:mm a")}
            </div>
          </div>
          <div className="small">
            ({moment(new Date(event.startTime)).fromNow()}, for{" "}
            {calculateDuration(event)})
          </div>
        </div>
        {event.data > 0 && (
          <div className="margin-tb-m flex-container">
            <Speedometer2 className="margin-lr-m" />
            <div className="bold">
              {event.data} {event.unit}
            </div>
          </div>
        )}
        <div className="margin-tb-m mobile-width-container">
          {event.imageUrl && (
            <img
              className="event-photo"
              src={event.imageUrl}
              alt={event.subcategory?.name}
            />
          )}
          <div>{event.description}</div>
        </div>
        {event.causeForConcern && (
          <div className="margin-tb-m flex-container">
            <ExclamationCircleFill className="margin-lr-m" />
            <div className="small italic">
              You marked this activity as worrying
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
