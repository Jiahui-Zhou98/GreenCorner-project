import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Hero Section */}
      <header className="hero-section">
        <img
          src="/banner.png"
          alt="GreenCorner plant community banner"
          className="hero-image"
        />
  
        <div className="hero-layer" aria-hidden="true"></div>

        <Container className="hero-inner">
          <div className="hero-content">
            {/* Added banner-text class for targeted styling */}
            <h1 className="display-3 fw-bold banner-text">
              GreenCorner
            </h1>
            <p className="lead banner-text">
              Share • Trade • Grow plants together
            </p>                
          </div>
        </Container>
      </header>

      {/* Main Call to Action Section (Stays dark/normal text) */}
      <main id="main-content" role="main">
      <section className="py-5 bg-light">
        <Container className="text-center py-5">
          <h2 className="section-title fw-bold">Ready to Get Started?</h2>
          <p className="section-subtitle text-muted mb-4">
            Join our growing community of plant owners, collectors, and nature
            lovers.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn-primary-custom">
              Register
            </Link>

            <Link to="/login" className="btn-secondary-custom">
              Sign In
            </Link>
          </div>
        </Container>
      </section>
      </main>
    </div>
  );
}
