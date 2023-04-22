import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" fixed="bottom">
      <Nav>
        <Nav.Link
          onClick={() => {
            navigate("/account");
          }}
        >
          Account
        </Nav.Link>
        <Nav.Link>Feed</Nav.Link>
        <Nav.Link
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
