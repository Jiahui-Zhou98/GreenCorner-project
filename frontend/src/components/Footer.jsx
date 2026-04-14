import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-brand-text">GreenCorner</span>
            <p className="footer-tagline">A community for plant lovers.</p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <Link to="/" className="footer-link">
              Home
            </Link>
            <Link to="/about" className="footer-link">
              About
            </Link>
            <Link to="/careposts" className="footer-link">
              Care Guides
            </Link>
            <Link to="/listings" className="footer-link">
              Marketplace
            </Link>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; 2025 GreenCorner. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
