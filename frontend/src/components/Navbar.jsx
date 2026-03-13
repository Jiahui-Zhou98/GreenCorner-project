import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import "./Navbar.css";

function TripleLeafIcon() {
  return (
    <svg
      className="navbar-leaf-icon"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leafGradMain" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#5a9a5a" />
          <stop offset="100%" stopColor="#2c4f34" />
        </linearGradient>
        <linearGradient id="leafGradSide" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a7c4a" />
          <stop offset="100%" stopColor="#2c4f34" />
        </linearGradient>
      </defs>

      <path
        d="M19 25 C13 21 10 13 19 7 C28 13 25 21 19 25Z"
        fill="url(#leafGradSide)"
        opacity="0.45"
        transform="rotate(-46 19 25)"
      />

      <path
        d="M19 25 C13 21 10 13 19 7 C28 13 25 21 19 25Z"
        fill="url(#leafGradSide)"
        opacity="0.45"
        transform="rotate(46 19 25)"
      />

      <path
        d="M19 26 C13 22 10 14 19 7 C28 14 25 22 19 26Z"
        fill="url(#leafGradMain)"
      />

      <line
        x1="19"
        y1="26"
        x2="19"
        y2="14"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <line
        x1="19"
        y1="21"
        x2="15"
        y2="17"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <line
        x1="19"
        y1="18"
        x2="23"
        y2="14"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />

      <line
        x1="19"
        y1="26"
        x2="19"
        y2="33"
        stroke="#2c4f34"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
