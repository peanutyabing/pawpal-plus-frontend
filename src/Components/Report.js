import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../Hooks/useAxiosPrivate.js";
import { axiosDefault } from "../Axios.js";
import { defaultPetPhoto } from "../Utils.js";
import moment from "moment";
import DoughnutChart from "../Analytics/DoughnutChart.js";
import LineChart from "../Analytics/LineChart.js";

export default function Report() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const [petProfile, setPetProfile] = useState({});
  const [petEvents, setPetEvents] = useState([]);
  const [eventsByCategory, setEventsByCategory] = useState({});
  const [eventsBySubcategory, setEventsBySubcategory] = useState({});
  const [categoriesMap, setCategoriesMap] = useState({});
  const [subcategoriesMap, setSubcategoriesMap] = useState({});

  useEffect(() => {
    retrievePetProfile();
  }, []);

  const retrievePetProfile = async () => {
    try {
      const profile = await axiosPrivate.get(`/my-pets/${petId}`);
      setPetProfile(profile?.data[0]);
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
    getSubcategories();
  }, []);

  const getCategories = async () => {
    try {
      const categories = await axiosDefault.get("/categories");
      const mapping = {};
      for (const category of categories.data) {
        mapping[category.id] = category.name;
      }
      setCategoriesMap(mapping);
    } catch (err) {
      console.log(err);
    }
  };

  const getSubcategories = async () => {
    try {
      const subcategories = await axiosDefault.get("/subcategories");
      const mapping = {};
      for (const subcategory of subcategories.data) {
        mapping[subcategory.id] = subcategory.name;
      }
      setSubcategoriesMap(mapping);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    groupEventsByCategory();
    groupEventsBySubcategory();
  }, []);

  const groupEventsByCategory = async () => {
    try {
      const grouped = await axiosPrivate.get(
        `/analytics/${petId}/events-by-category`
      );
      setEventsByCategory(grouped.data);
    } catch (err) {
      console.log(err);
    }
  };

  const groupEventsBySubcategory = async () => {
    try {
      const grouped = await axiosPrivate.get(
        `/analytics/${petId}/events-by-subcategory`
      );
      setEventsBySubcategory(grouped.data);
    } catch (err) {
      console.log(err);
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

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex-container margin-tb-m">
          <img
            className="profile-xs margin-lr-m"
            src={petProfile?.imageUrl || defaultPetPhoto}
            alt={petProfile?.name}
          />
          <div className="large">
            Analysis of {petProfile?.name}'s activities
          </div>
        </div>
        <div>
          <span className="x-bold">{petEvents?.length}</span>{" "}
          {petEvents.length > 1 ? "activities" : "activity"}
        </div>

        {petEvents.length > 0 && (
          <div>
            Documented over{" "}
            <span className="x-bold">
              {moment
                .duration(
                  new Date(petEvents[0]?.startTime) -
                    new Date(petEvents.slice(-1)[0]?.startTime)
                )
                .humanize()}
            </span>
          </div>
        )}

        {petEvents.length > 0 && (
          <div className="mobile-width-container">
            <div className="graph-container margin-tb-m">
              <div className="dark small bold">
                No. of activities by category
              </div>
              <DoughnutChart
                data={eventsByCategory}
                colMapping={categoriesMap}
              />
            </div>
            <div className="graph-container margin-tb-m">
              <div className="dark small bold">
                No. of activities by sub-category
              </div>
              <DoughnutChart
                data={eventsBySubcategory}
                colMapping={subcategoriesMap}
              />
            </div>
            <div className="graph-container margin-tb-m">
              <div className="dark small bold">Weight change</div>
              <LineChart
                data={petEvents.filter((event) => event.subcategoryId === 17)}
              />
            </div>
          </div>
        )}
        <div className="small italic margin-tb-sm">
          Generated on {moment(new Date()).format("MMMM DD YYYY, h:mm a")}
        </div>
      </header>
    </div>
  );
}
