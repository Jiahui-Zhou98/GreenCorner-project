import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section using your banner.png */}
      <section 
        className="hero-section" 
        style={{ backgroundImage: `url('/banner.png')` }}
      >
        <div className="hero-layer"></div>

        <Container className="hero-inner">
          <div className="hero-content">
            <h1 className="display-3 fw-bold">
              GreenCorner <br />
              Happy Growing
            </h1>
            <p className="lead">
              A community platform connecting plant lovers. <br />
              A simple bridge for direct connection and expert care.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Call to Action Section */}
      <section className="py-5 bg-light">
        <Container className="text-center py-5">
          <h2 className="section-title fw-bold">Ready to Get Started?</h2>
          <p className="section-subtitle text-muted mb-4">
            Join our growing community of plant owners, collectors, and nature lovers.
          </p>
          
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/listings" className="btn-primary-custom">
              Browse Plant Listings
            </Link>
            
            <Link to="/careposts" className="btn-secondary-custom">
              Explore Care Guides
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}