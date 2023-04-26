import "./App.css";
import "animate.css";
import logo from "./Images/PawPal-logo-1.png";
import { Link } from "react-router-dom";
import useAuth from "./Hooks/useAuth";

export default function App() {
  const { auth } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        <img
          className="App-logo-lg animate__animated animate__rotateIn"
          src={logo}
          alt="PawPal"
        />
        <h1 className="x-large x-bold margin-tb-l">Welcome to PawPal!</h1>
        <div className="margin-tb-sm">
          Take a quick{" "}
          <Link to="/my-pets/add-pet-example" className="bold">
            tour
          </Link>
        </div>
        {!auth.token && (
          <div className="margin-tb-sm">
            Been here before?{" "}
            <Link to="/account/sign-in" className="bold">
              Sign in
            </Link>
          </div>
        )}
        {!auth.token && (
          <div className="margin-tb-sm">
            New user?{" "}
            <Link to="/account/sign-up" className="bold">
              Sign up
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}
