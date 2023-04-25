import { Navbar, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

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
