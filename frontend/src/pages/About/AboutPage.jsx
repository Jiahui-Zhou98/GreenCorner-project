import { Container, Row, Col, Card, Button } from "react-bootstrap";
import BubbleHero from "./BubbleHero.jsx";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero — floating bubble images */}
      <BubbleHero />

      {/* 2. Our Mission */}
      <section className="about-mission">
        <Container>
          <h2 className="mb-4">Why GreenCorner?</h2>
          <Row className="g-4">
            <Col md={6}>
              <p>
                Beginners often struggle to find trustworthy, practical advice —
                what light does my monstera need? Am I overwatering? GreenCorner
                gives newcomers access to real community knowledge, not generic
                guides.
              </p>
            </Col>
            <Col md={6}>
              <p>
                Experienced plant lovers accumulate more cuttings, pots, and
                plants than they can handle. Instead of letting them go to
                waste, GreenCorner lets you list them for free, sale, or
                rehoming — connecting them with people who will love them.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 3. What You Can Do */}
      <section className="about-features">
        <Container>
          <h2 className="text-center mb-5">What You Can Do</h2>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Card className="about-card h-100 shadow-sm">
                <Card.Body className="p-5">
                  <Card.Title>Learn &amp; Share</Card.Title>
                  <Card.Text>
                    Browse care posts from experienced plant owners. Find advice
                    on watering, lighting, propagation, and common problems like
                    pests or yellow leaves.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="about-card h-100 shadow-sm">
                <Card.Body className="p-5">
                  <Card.Title>Find Local Plants</Card.Title>
                  <Card.Text>
                    Discover affordable or free plants near you. Filter by plant
                    type, price, and listing status to find the perfect addition
                    to your collection.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="about-card h-100 shadow-sm">
                <Card.Body className="p-5">
                  <Card.Title>Rehome with Care</Card.Title>
                  <Card.Text>
                    Moving or downsizing? List your plants for sale, free
                    adoption, or rehoming. Give your plants a second life with
                    someone who will cherish them.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 4. Call to Action */}
      <section className="about-cta text-center">
        <Container>
          <h2 className="mb-4">Get Started</h2>
          <div className="cta-steps">
            <div className="cta-step">
              <p className="cta-step-title">Share Care Tips</p>
              <p className="cta-step-desc">
                Write a care post about any plant you know well — watering
                schedules, light needs, propagation tricks, or common problems.
                Help beginners avoid the mistakes you once made.
              </p>
              <Button href="/careposts" className="btn-green cta-btn">
                Go to Care Posts
              </Button>
            </div>
            <div className="cta-divider" aria-hidden="true" />
            <div className="cta-step">
              <p className="cta-step-title">Browse the Marketplace</p>
              <p className="cta-step-desc">
                Find plants listed as free, for sale, or rehoming near you.
                Filter by type, condition, and location — then contact the
                seller directly to arrange a pickup.
              </p>
              <Button href="/listings" className="btn-green cta-btn">
                Explore Listings
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
