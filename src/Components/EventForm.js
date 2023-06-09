import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { axiosDefault } from "../Axios.js";
import useAxiosPrivate from "../Hooks/useAxiosPrivate.js";
import { storage } from "../Firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Form, FloatingLabel, Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Alerts from "./Alerts.js";
import { ArrowLeftShort } from "react-bootstrap-icons";
import { defaultPetPhoto } from "../Utils.js";
import moment from "moment";

export default function EventForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { petId } = useParams();
  const [petProfile, setPetProfile] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState(null);
  const [event, setEvent] = useState({
    categoryId: "",
    subcategoryId: "",
    startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
    endTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
    causeForConcern: false,
    description: "",
    data: "",
    unit: "",
    imageUrl: "",
    remindMe: false,
  });
  const [imageFile, setImageFile] = useState("");
  const [imageInputValue, setImageInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertKey, setAlertKey] = useState("");

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
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const categories = await axiosDefault.get(`/categories`);
      setCategoryList(categories.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSubcategories();
  }, [event.categoryId]);

  const getSubcategories = async () => {
    if (!event.categoryId) {
      return;
    }
    try {
      const subcategories = await axiosDefault.get(
        `/categories/${event.categoryId}/subcategories`
      );
      setSubcategoryList(subcategories.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = (selected) => {
    const eventToUpdate = { ...event };
    eventToUpdate[selected.name] = selected.value;
    setEvent(eventToUpdate);
  };

  const handleCreatableSelect = (selected) => {
    if (selected.__isNew__) {
      const newValue =
        selected.value[0].toUpperCase() + selected.value.substring(1);
      setNewSubcategory({ name: newValue });
    } else {
      handleSelect(selected);
    }
  };

  const handleChange = (e) => {
    const eventToUpdate = { ...event };
    eventToUpdate[e.target.name] = e.target.value;
    setEvent(eventToUpdate);
  };

  const handleFileChange = (e) => {
    setImageInputValue(e.target.value);
    setImageFile(e.target.files[0]);
  };

  const toggleSwitch = (e) => {
    const eventToUpdate = { ...event };
    eventToUpdate[e.target.name] = !eventToUpdate[e.target.name];
    setEvent(eventToUpdate);
  };

  useEffect(() => {
    if (event.remindMe && getReminderTopic()) {
      setShowAlert(true);
      setAlertKey("reminderSet");
    }
  }, [event.remindMe]);

  const getReminderTopic = () => {
    if (subcategoryList.length && event.subcategoryId) {
      const selectedSubcategory = subcategoryList.filter(
        (subcat) => subcat.id === event.subcategoryId
      )[0];
      return selectedSubcategory && selectedSubcategory.name.toLowerCase();
    } else if (newSubcategory) {
      return newSubcategory.name.toLowerCase();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !event.startTime ||
      !event.categoryId ||
      (!event.subcategoryId && !newSubcategory)
    ) {
      setShowAlert(true);
      setAlertKey("eventFormCompletion");
      return;
    }
    setSubmitting(true);

    const newSubcategoryId = await createSubcategory();
    const imageUrl = await uploadFile();
    await writeData(imageUrl, newSubcategoryId);
  };

  const createSubcategory = async () => {
    if (!newSubcategory) {
      return null;
    }
    try {
      const newSubcategoryRes = await axiosDefault.post(
        `/categories/${event.categoryId}/subcategories`,
        newSubcategory
      );
      return newSubcategoryRes.data.id;
    } catch (err) {
      console.log(err);
    }
  };

  const uploadFile = async () => {
    if (!imageFile) {
      return Promise.resolve("");
    }
    const fileRef = ref(storage, `pet-events/${imageFile.name}`);
    return uploadBytes(fileRef, imageFile)
      .then(() => getDownloadURL(fileRef))
      .catch((err) => {
        console.log(err);
      });
  };

  const writeData = async (imageUrl, newSubcategoryId) => {
    const requestBody = { ...event, imageUrl };
    if (newSubcategoryId) {
      requestBody.subcategoryId = newSubcategoryId;
    }
    if (!requestBody.endTime) {
      requestBody.endTime = new Date().toISOString();
    }
    for (const key in requestBody) {
      if (requestBody[key] === null || requestBody[key] === "") {
        delete requestBody[key];
      }
    }
    try {
      await axiosPrivate.post(`/my-pets/${petId}/events`, requestBody);
    } catch (err) {
      console.log(err);
    }
    navigate(`/my-pets/${petId}/events`);
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
            src={petProfile.imageUrl || defaultPetPhoto}
            alt={petProfile.name}
          />
          <div className="x-large">{petProfile.name}'s new activity</div>
        </div>
        <Form className="margin-lr-m" onSubmit={handleSubmit}>
          <Form.Group className="margin-tb-m">
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select a category"
              isSearchable={true}
              options={categoryList.map((category) => {
                return {
                  value: category.id,
                  label: category.name,
                  name: "categoryId",
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
            <CreatableSelect
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select or create a subcategory"
              isSearchable={true}
              options={subcategoryList.map((subcat) => {
                return {
                  value: subcat.id,
                  label: subcat.name,
                  name: "subcategoryId",
                };
              })}
              onChange={handleCreatableSelect}
              styles={{
                option: (provided) => ({
                  ...provided,
                  color: "#222831",
                }),
              }}
            />
          </Form.Group>
          {event.subcategoryId === 17 && (
            <Form.Group className="margin-tb-m flex-container">
              <Form.Control
                name="data"
                type="number"
                value={event.data}
                onChange={handleChange}
                placeholder="Weight"
              />
              <div className="margin-lr-sm"> </div>
              <Form.Control
                name="unit"
                type="text"
                value={event.unit}
                onChange={handleChange}
                placeholder="Unit"
              />
            </Form.Group>
          )}
          <Form.Group className="margin-tb-m">
            <Form.Control
              name="description"
              type="text"
              as="textarea"
              rows={2}
              value={event.description}
              onChange={handleChange}
              placeholder="More details (optional)"
            />
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel className="dark" label="Started at">
              <Form.Control
                name="startTime"
                type="datetime-local"
                value={event.startTime}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel className="dark" label="Ended at">
              <Form.Control
                name="endTime"
                type="datetime-local"
                value={event.endTime}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <FloatingLabel className="dark" label="Upload a photo (optional)">
              <Form.Control
                name="imageUrl"
                type="file"
                value={imageInputValue}
                onChange={handleFileChange}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="margin-tb-m">
            <Form.Check
              type="switch"
              className="margin-lr-m"
              name="causeForConcern"
              label="I'm worried"
              checked={event.causeForConcern}
              onChange={toggleSwitch}
            />
            <Form.Check
              type="switch"
              name="remindMe"
              className="margin-lr-m"
              label="Remind me to do this again"
              checked={event.remindMe}
              onChange={toggleSwitch}
            />
          </Form.Group>

          <Form.Group className="margin-tb-m">
            {submitting ? (
              <Button variant="light" size="sm" disabled>
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
              <Button type="submit" size="sm" variant="light">
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
          petName={petProfile.name}
          topic={getReminderTopic()}
        />
      </header>
    </div>
  );
}
