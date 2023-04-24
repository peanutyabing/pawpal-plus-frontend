import "./App.css";
import "animate.css";
import logo from "./Images/PawPal-logo-1.png";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          className="App-logo-lg animate__animated animate__rotateIn"
          src={logo}
          alt="PawPal"
        />
        <h1 className="x-large xx-bold margin-tb-l">Welcome to PawPal!</h1>
        <div className="margin-tb-m">
          Take a quick{" "}
          <Link to="/my-pets/add-pet-example" className="bold">
            tour
          </Link>
        </div>
        <div className="margin-tb-m">
          Been here before?{" "}
          <Link to="/account/sign-in" className="bold">
            Sign in
          </Link>
        </div>
      </header>
    </div>
  );
}
