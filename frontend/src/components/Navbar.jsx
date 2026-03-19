import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import TripleLeafIcon from "./TripleLeafIcon.jsx";
import "./Navbar.css";

export default function AppNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <TripleLeafIcon />
          <span className="brand-text">
            <span className="brand-green">Green</span>
            <span className="brand-corner">Corner</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-1">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/careposts">
              Care
            </Nav.Link>
            <Nav.Link as={NavLink} to="/listings">
              Market
            </Nav.Link>
            {user ? (
              <Button
                className="ms-3 signin-btn"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                className="ms-3 signin-btn"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
