import { useEffect, useState } from "react";
import axios from "axios";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { BACKEND_URL, USERID } from "../Constants.js";

export default function PetForm() {
  const [speciesList, setSpeciesList] = useState([]);
  const [breedsList, setBreedsList] = useState([]);
  const [profile, setProfile] = useState({
    speciesId: "",
    breedId: "",
    name: "",
    imageUrl: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    getSpecies();
  }, []);

  const getSpecies = async () => {
    const species = await axios.get(
      `${BACKEND_URL}/users/${USERID}/pets/species`
    );
    setSpeciesList(species.data);
  };

  useEffect(() => {
    getBreeds();
  }, [profile.speciesId]);

  const getBreeds = async () => {
    if (!profile.speciesId) {
      return;
    }
    const breeds = await axios.get(
      `${BACKEND_URL}/users/${USERID}/pets/species/${profile.speciesId}/breeds`
    );
    setBreedsList(breeds.data);
  };

  const handleChange = (e) => {
    const profileToUpdate = { ...profile };
    profileToUpdate[e.target.name] = e.target.value;
    setProfile(profileToUpdate);
  };

  const handleFileChange = (e) => {
    // put the url in the profile object in state
    // put the actual file in a separate state string
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="x-large">New pet</h1>
        <Form className="margin-lr-m">
          <Form.Group className="margin-tb-m">
            <Form.Select
              onChange={handleChange}
              name="speciesId"
              defaultValue=""
            >
              <option value="" disabled hidden>
                What species is your pet?
              </option>
              {speciesList.map((oneSpecies) => (
                <option key={oneSpecies.id} value={oneSpecies.id}>
                  {oneSpecies.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <Form.Select onChange={handleChange} name="breedId" defaultValue="">
              <option value="" disabled hidden>
                What breed is your pet?
              </option>
              {breedsList.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <Form.Control
              name="name"
              type="text"
              value={profile.name}
              onChange={handleChange}
              placeholder="Name"
            />
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel className="dark" label="Profile photo">
              <Form.Control
                name="imageUrl"
                type="file"
                value={profile.imageUrl}
                onChange={handleFileChange}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel className="dark" label="Date of birth">
              <Form.Control
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Form.Group>
        </Form>
      </header>
    </div>
  );
}
