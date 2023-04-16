import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storage } from "../Firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import { BACKEND_URL, USERID } from "../Constants.js";

export default function PetForm() {
  const navigate = useNavigate();
  const [speciesList, setSpeciesList] = useState([]);
  const [breedsList, setBreedsList] = useState([]);
  const [profile, setProfile] = useState({
    speciesId: "",
    breedId: "",
    name: "",
    dateOfBirth: "",
  });
  const [imageFile, setImageFile] = useState("");
  const [imageInputValue, setImageInputValue] = useState("");

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
    setImageInputValue(e.target.value);
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile.speciesId || !profile.name) {
      alert("Please complete your pet's profile.");
    }
    uploadFile()
      .then((imageUrl) => writeData(imageUrl))
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadFile = async () => {
    if (!imageFile) {
      return Promise.resolve("");
    }
    const fileRef = ref(storage, `pet-profiles/${imageFile.name}`);
    return uploadBytes(fileRef, imageFile).then(() => getDownloadURL(fileRef));
  };

  const writeData = async (imageUrl) => {
    await axios.post(`${BACKEND_URL}/users/${USERID}/pets/`, {
      ...profile,
      imageUrl,
    });
    setProfile({
      speciesId: "",
      breedId: "",
      name: "",
      dateOfBirth: "",
    });
    setImageFile("");
    setImageInputValue("");
    navigate("/my-pets");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="x-large">New pet</h1>
        <Form className="margin-lr-m" onSubmit={handleSubmit}>
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
                value={imageInputValue}
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
          <Form.Group className="margin-tb-m">
            <Button type="submit" variant="light">
              Submit
            </Button>
          </Form.Group>
        </Form>
      </header>
    </div>
  );
}
