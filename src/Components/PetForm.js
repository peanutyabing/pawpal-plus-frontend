import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storage } from "../Firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Form, FloatingLabel, Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import { BACKEND_URL } from "../Constants.js";
import Alerts from "./Alerts.js";
import { ArrowLeftShort } from "react-bootstrap-icons";
import useAuth from "../Hooks/useAuth.js";

export default function PetForm() {
  const navigate = useNavigate();
  const { auth } = useAuth();
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
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertKey, setAlertKey] = useState("");

  useEffect(() => {
    getSpecies();
  }, []);

  const getSpecies = async () => {
    const species = await axios.get(`${BACKEND_URL}/my-pets/species`);
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
      `${BACKEND_URL}/my-pets/species/${profile.speciesId}/breeds`
    );
    setBreedsList(breeds.data);
  };

  const handleSelect = (selected) => {
    const profileToUpdate = { ...profile };
    profileToUpdate[selected.name] = selected.value;
    setProfile(profileToUpdate);
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
      setShowAlert(true);
      setAlertKey("petFormCompletion");
      return;
    }
    setSubmitting(true);
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
    const requestBody = { ...profile, imageUrl };
    for (const key in requestBody) {
      if (!requestBody[key]) {
        delete requestBody[key];
      }
    }
    await axios.post(`${BACKEND_URL}/my-pets`, requestBody, {
      headers: { Authorization: `Bearer ${auth.token}` },
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
        <div
          className="top-btn-container bold"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftShort />
          Back
        </div>
        <h1 className="x-large">New pet</h1>
        <Form className="margin-lr-m" onSubmit={handleSubmit}>
          <Form.Group className="margin-tb-m">
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="What species is your pet?"
              isSearchable={true}
              options={speciesList.map((oneSpecies) => {
                return {
                  value: oneSpecies.id,
                  label: oneSpecies.name,
                  name: "speciesId",
                };
              })}
              onChange={handleSelect}
              styles={{
                option: (provided) => ({
                  ...provided,
                  color: "#222831",
                }),
              }}
            />
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="What breed best describes your pet?"
              isSearchable={true}
              options={breedsList.map((breed) => {
                return {
                  value: breed.id,
                  label: breed.name,
                  name: "breedId",
                };
              })}
              onChange={handleSelect}
              styles={{
                option: (provided) => ({
                  ...provided,
                  color: "#222831",
                }),
              }}
            />
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
            {submitting ? (
              <Button variant="light" disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Submitting...</span>
              </Button>
            ) : (
              <Button type="submit" variant="light">
                Submit
              </Button>
            )}
          </Form.Group>
        </Form>
        <Alerts
          showAlert={showAlert}
          hideAlert={() => {
            setShowAlert(false);
          }}
          alertKey={alertKey}
        />
      </header>
    </div>
  );
}
