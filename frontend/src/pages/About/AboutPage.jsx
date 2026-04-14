import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import community1 from "../../assets/about/community1.png";
import community2 from "../../assets/about/community2.png";
import community3 from "../../assets/about/community3.png";
import "./AboutPage.css";

const carouselImages = [community1, community2, community3];

export default function AboutPage() {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="about-page">
      {/* 1. Hero — asymmetric, left-aligned, with decorative SVG */}
      <section className="about-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <p className="about-hero-label">About GreenCorner</p>
              <h1 className="about-hero-heading">
                A community built around plants and the people who love them.
              </h1>
              <p className="about-hero-sub">
                GreenCorner is a community platform for plant lovers. Share care
                tips and grow guides, buy or rehome plants locally, and connect
                with growers who actually care where their plants end up.
              </p>
            </Col>
            <Col lg={5} className="d-none d-lg-flex justify-content-center">
              <div className="community-carousel">
                {carouselImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Community photo ${i + 1}`}
                    className={`community-carousel-img ${i === carouselIndex ? "community-carousel-active" : ""}`}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. How It Works — numbered steps, not cards */}
      <section className="about-steps">
        <Container>
          <h2 className="about-section-heading">How it works</h2>
          <div className="about-steps-list">
            <div className="about-step">
              <span className="about-step-num">1</span>
              <div>
                <h3 className="about-step-title">Browse or post</h3>
                <p className="about-step-desc">
                  List a plant you want to rehome, or search the marketplace for
                  something new. Filter by type, price, or condition.
                </p>
              </div>
            </div>
            <div className="about-step">
              <span className="about-step-num">2</span>
              <div>
                <h3 className="about-step-title">Learn from the community</h3>
                <p className="about-step-desc">
                  Read care guides written by real plant owners. Watering
                  schedules, light needs, pest fixes, propagation tips.
                </p>
              </div>
            </div>
            <div className="about-step">
              <span className="about-step-num">3</span>
              <div>
                <h3 className="about-step-title">Connect and grow</h3>
                <p className="about-step-desc">
                  Every plant finds a home. Every question gets an answer. That
                  is the whole idea.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Values — two-column asymmetric */}
      <section className="about-values">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <h2 className="about-section-heading">Why this exists</h2>
              <p className="about-values-text">
                Most plant communities live on social media, buried under
                algorithms and ads. GreenCorner is different. No feed. No
                followers. Just plants, people, and honest advice.
              </p>
              <p className="about-values-text">
                We think the best plant knowledge comes from the person who kept
                a fiddle leaf fig alive for three years, not a sponsored post.
                And the best way to get a new plant is from someone nearby who
                actually cares where it ends up.
              </p>
            </Col>
            <Col lg={{ span: 6, offset: 1 }}>
              <div className="about-values-grid">
                <div className="about-value-item">
                  <span className="about-value-marker"></span>
                  <div>
                    <h4 className="about-value-label">Local first</h4>
                    <p className="about-value-desc">
                      Find plants and plant people in your area. No shipping
                      fees, no wilted arrivals.
                    </p>
                  </div>
                </div>
                <div className="about-value-item">
                  <span className="about-value-marker"></span>
                  <div>
                    <h4 className="about-value-label">Knowledge over clout</h4>
                    <p className="about-value-desc">
                      Care tips ranked by usefulness, not likes. Real advice
                      from real growers.
                    </p>
                  </div>
                </div>
                <div className="about-value-item">
                  <span className="about-value-marker"></span>
                  <div>
                    <h4 className="about-value-label">
                      Every plant deserves a home
                    </h4>
                    <p className="about-value-desc">
                      Free adoption listings sit right next to paid ones. No
                      gatekeeping.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 4. Getting Started — instructional */}
      <section className="about-start">
        <Container>
          <div className="about-start-inner">
            <h2 className="about-section-heading">Getting started</h2>
            <ul className="about-start-list">
              <li>
                In the{" "}
                <a
                  href="/listings"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/listings");
                  }}
                  className="about-start-link"
                >
                  Marketplace
                </a>
                , you can browse plant listings near you, post plants for sale
                or free adoption, and find your next green friend.
              </li>
              <li>
                In the{" "}
                <a
                  href="/careposts"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/careposts");
                  }}
                  className="about-start-link"
                >
                  Care Guides
                </a>
                , you can read and write care tips on watering, lighting,
                propagation, and more.
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </div>
  );
}
