import { Navbar, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Images/PawPal-logo-1.png";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabColor = (tabName) => {
    const relativeLocation = location.pathname;
    if (relativeLocation.includes(tabName)) {
      return "#ff5722";
    } else {
      return "#212529";
    }
  };

  return (
    <Navbar bg="dark" variant="dark" fixed="bottom">
      <Navbar.Brand
        onClick={() => {
          navigate("/");
        }}
      >
        <img src={logo} alt="PawPal" className="App-logo-xs" />
      </Navbar.Brand>
      <Nav>
        <Nav.Link
          style={{ backgroundColor: getTabColor("account") }}
          onClick={() => {
            navigate("/account");
          }}
        >
          Account
        </Nav.Link>
        <Nav.Link>Feed</Nav.Link>
        <Nav.Link
          style={{ backgroundColor: getTabColor("my-pets") }}
          onClick={() => {
            navigate("/my-pets");
          }}
        >
          My pets
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
