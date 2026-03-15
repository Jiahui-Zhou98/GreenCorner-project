import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
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

      {/* 4. Get Started */}
      <section className="about-cta text-center">
        <Container>
          <h2 className="text-center mb-5">Get Started</h2>
          <Row className="g-4 justify-content-center">
            <Col md={6}>
              <Card className="about-card h-100 shadow-sm">
                <Card.Body className="p-5">
                  <Card.Title>
                    <Link to="/careposts" className="cta-link">
                      Share Care Tips
                    </Link>
                  </Card.Title>
                  <Card.Text>
                    Write a care post about any plant you know well — watering
                    schedules, light needs, propagation tricks, or common
                    problems. Help beginners avoid the mistakes you once made.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="about-card h-100 shadow-sm">
                <Card.Body className="p-5">
                  <Card.Title>
                    <Link to="/listings" className="cta-link">
                      Browse the Marketplace
                    </Link>
                  </Card.Title>
                  <Card.Text>
                    Find plants listed as free, for sale, or rehoming near you.
                    Filter by type, condition, and location — then contact the
                    seller directly to arrange a pickup.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
