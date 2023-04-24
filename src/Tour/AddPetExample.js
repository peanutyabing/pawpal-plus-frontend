import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { PlusCircleFill } from "react-bootstrap-icons";
import CurlyArrow from "../Images/Curly-arrow.png";

export default function AddPetExample() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <div className="margin-tb-l animate__animated animate__bounceInDown">
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
        <div className="hint">
          <div className="large bold">
            This button lets you add a pet. <br />
            Give it a click!
          </div>
          <img
            className="guide-arrow"
            src={CurlyArrow}
            alt="Add pet using the + button"
          />
        </div>

        <div className="bottom-btn-container">
          <PlusCircleFill
            className="custom-btn"
            onClick={() => {
              navigate("/my-pets/pet-form-example");
            }}
          />
        </div>
      </header>
    </div>
  );
}
