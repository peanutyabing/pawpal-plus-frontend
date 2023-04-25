import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { calculateAge, defaultPetPhoto } from "../Utils.js";
import { PlusCircleFill } from "react-bootstrap-icons";
import CurlyArrow from "../Images/Curly-arrow.png";
import Reminders from "./Reminders.js";
import useAxiosPrivate from "../Hooks/useAxiosPrivate.js";

export default function MyPets() {
  const [myPets, setMyPets] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    retrievePets();
  }, []);

  const retrievePets = async () => {
    try {
      const pets = await axiosPrivate.get("/my-pets");
      setMyPets(pets.data);
    } catch (err) {
      console.log(err);
      navigate("/account/sign-in", {
        state: { from: location },
        replace: true,
      });
    }
  };

  const displayPets = () => {
    if (!myPets.length) {
      return;
    }
    return myPets.map((pet) => (
      <Carousel.Item
        key={pet.id}
        onClick={() => {
          navigate(`./${pet.id}`);
        }}
      >
        <img
          className="profile-lg"
          src={pet.imageUrl ? pet.imageUrl : defaultPetPhoto}
          alt={pet.name}
        />
        <Carousel.Caption>
          <h2 className="large bold">{pet.name}</h2>
          <h3 className="medium">{pet.breed?.name}</h3>
          <h3 className="medium">{calculateAge(pet.dateOfBirth)}</h3>
        </Carousel.Caption>
      </Carousel.Item>
    ));
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Reminders />
        {myPets.length ? (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            controls={myPets.length > 1}
            indicators={myPets.length > 1}
          >
            {displayPets()}
          </Carousel>
        ) : (
          <div className="hint">
            <div className="large bold">
              You don't have a pet yet! <br /> Click here to add one
            </div>
            <img
              className="guide-arrow"
              src={CurlyArrow}
              alt="Add pet using the + button"
            />
          </div>
        )}

        <div className="bottom-btn-container">
          <PlusCircleFill
            className="custom-btn"
            onClick={() => {
              navigate("/my-pets/add-pet");
            }}
          />
        </div>
      </header>
    </div>
  );
}
