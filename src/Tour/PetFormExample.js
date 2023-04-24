import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import PetForm from "../Images/pet-form-example.png";
import CurlyArrowUp from "../Images/Curly-arrow-up.png";

export default function PetFormExample() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <div className="margin-tb-m animate__animated animate__bounceInDown">
          <Button
            className="margin-tb-m"
            variant="outline-light"
            onClick={() => {
              navigate("/my-pets");
            }}
          >
            Skip tutorial
          </Button>
        </div>
        <img className="example margin-tb-l" src={PetForm} alt="form" />
        <Button
          variant="light"
          onClick={() => {
            navigate("/my-pets/view-pet-example");
          }}
        >
          Submit
        </Button>
        <div className="hint-left">
          <img
            src={CurlyArrowUp}
            alt="Click on submit"
            className="guide-arrow"
          />
          <div>Click submit to view your pet's profile</div>
        </div>
      </header>
    </div>
  );
}
