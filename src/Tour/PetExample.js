import { useNavigate } from "react-router-dom";
import { Carousel, Button } from "react-bootstrap";
import { defaultPetPhoto } from "../Utils";
import { PlusCircleFill } from "react-bootstrap-icons";

export default function PetExample() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <div className="instruction margin-tb-m animate__animated animate__bounceInDown">
          <div className="large bold margin-tb-m">
            Click on the pet's profile for more details and log activities
          </div>
          <div>
            <Button
              className="margin-tb-m margin-lr-m"
              variant="outline-light"
              size="sm"
              onClick={() => {
                navigate("/posts");
              }}
            >
              Show me more
            </Button>
            <Button
              className="margin-tb-m margin-lr-m"
              variant="outline-light"
              size="sm"
              onClick={() => {
                navigate("/");
              }}
            >
              End tour
            </Button>
          </div>
        </div>
        <Carousel controls={true} indicators={true}>
          <Carousel.Item id="pet-example">
            <img className="profile-lg" src={defaultPetPhoto} alt="Your pet" />
            <Carousel.Caption>
              <h2 className="large bold">Paw McCartney</h2>
              <h3 className="medium">Domestic Short Hair</h3>
              <h3 className="medium">3 years old</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <div id="add-pet-btn" className="bottom-btn-container">
          <PlusCircleFill className="custom-btn" />
        </div>
      </header>
    </div>
  );
}
