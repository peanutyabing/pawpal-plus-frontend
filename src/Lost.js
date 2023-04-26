import "./App.css";
import "animate.css";
import logo from "./Images/PawPal-logo-1.png";
import { Link } from "react-router-dom";

export default function Lost() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          className="App-logo-lg animate__animated animate__rotateIn"
          src={logo}
          alt="PawPal"
        />
        <h1 className="x-large xx-bold margin-tb-l">
          It seems that you lost your way
        </h1>
        <div className="margin-tb-sm">
          Go back to the{" "}
          <Link to="/" className="bold">
            app
          </Link>
        </div>
      </header>
    </div>
  );
}
