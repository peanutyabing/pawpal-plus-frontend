import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" fixed="bottom">
      <Nav>
        <Nav.Link>Account</Nav.Link>
        <Nav.Link>Feed</Nav.Link>
        <Nav.Link
          onClick={() => {
            navigate("my-pet");
          }}
        >
          My pet
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
