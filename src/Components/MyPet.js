import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../Constants.js";
import Carousel from "react-bootstrap/Carousel";

export default function MyPet() {
  // Hard coded - to be replaced when auth is in place
  const USERID = 1;

  const PLACEHOLDER_PIC =
    "https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80";

  const [myPets, setMyPets] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    retrievePets();
  }, []);

  const retrievePets = async () => {
    const pets = await axios.get(`${BACKEND_URL}/users/${USERID}/pets/`);
    setMyPets(pets.data);
  };

  const displayHeader = () => {
    if (myPets.length === 1) {
      return <h1 className="x-large x-bold">My furry friend</h1>;
    } else {
      return <h1 className="x-large x-bold">My furry friends</h1>;
    }
  };

  const displayPets = () => {
    return myPets.map((pet) => (
      <Carousel.Item key={pet.id}>
        <img
          className="profile-sm"
          src={pet.imageUrl ? pet.imageUrl : PLACEHOLDER_PIC}
          alt={pet.name}
        />
        <Carousel.Caption>
          <h2 className="large bold">{pet.name}</h2>
          <h3 className="medium">{calculateAge(pet)}</h3>
        </Carousel.Caption>
      </Carousel.Item>
    ));
  };

  const calculateAge = (pet) => {
    const dob = new Date(pet.dateOfBirth);
    const now = new Date();
    const ageInYears = (now - dob) / 1000 / 60 / 60 / 24 / 365;
    if (ageInYears >= 1) {
      return `${Math.floor(ageInYears)} years old`;
    } else {
      const ageInMonths = 12 * ageInYears;
      return `${Math.floor(ageInMonths)} months old`;
    }
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Note: authenticated users see a summary of pet profiles */}
        {displayHeader()}
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          controls={myPets.length > 1 ? true : false}
          indicators={myPets.length > 1 ? true : false}
        >
          {displayPets()}
        </Carousel>
      </header>
    </div>
  );
}
