import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import "./CarePostsPage.css";

const PLANT_TYPES = [
  "Tropical",
  "Succulent",
  "Herb",
  "Fern",
  "Flowering",
  "Cactus",
  "Foliage",
  "Trailing",
  "Aquatic",
  "Carnivorous",
  "Bulb",
  "Air Plant",
  "Bonsai",
];

const DIFFICULTIES = ["easy", "medium", "hard"];
const LIGHT_OPTIONS = ["low", "medium", "bright indirect", "direct sunlight"];

function CarePostCard({ post }) {
  return (
    <div className="carepost-card">
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="carepost-card-image"
        />
      ) : (
        <div className="carepost-card-hero">🌿</div>
      )}

      <div className="carepost-card-body">
        <div className="carepost-card-meta">
          <span className="carepost-meta-badge">{post.plantType}</span>
          <span className="carepost-meta-badge">{post.difficulty}</span>
        </div>

        <h3 className="carepost-card-title">{post.title}</h3>

        <p className="carepost-card-text">
          {post.content?.length > 120
            ? `${post.content.slice(0, 120)}...`
            : post.content}
        </p>

        <div className="carepost-card-details">
          <span>Light: {post.light || "N/A"}</span>
          <span>Watering: {post.watering || "N/A"}</span>
        </div>

        <div className="carepost-card-footer">
          <span className="carepost-card-author">By {post.author}</span>
          <Button
            className="carepost-detail-btn"
            href={`/careposts/${post._id}`}
          >
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CarePostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filters = {
    plantType: searchParams.get("plantType") || "",
    difficulty: searchParams.get("difficulty") || "",
    light: searchParams.get("light") || "",
  };

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        setError(null);

        const res = await fetch("/api/careposts");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        const postsArray = Array.isArray(data) ? data : [];
        setPosts(postsArray);
      } catch (err) {
        console.error("Failed to fetch care posts:", err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];

    if (filters.plantType) {
      result = result.filter((post) => post.plantType === filters.plantType);
    }

    if (filters.difficulty) {
      result = result.filter((post) => post.difficulty === filters.difficulty);
    }

    if (filters.light) {
      result = result.filter((post) => post.light === filters.light);
    }

    setFilteredPosts(result);
  }, [posts, filters.plantType, filters.difficulty, filters.light]);

  function handleFilterChange(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  }

  function handleReset() {
    setSearchParams({});
  }

  return (
    <div className="careposts-page">
      <Container className="careposts-body">
        <div className="careposts-layout">
          <aside className="careposts-sidebar">
            <div className="sidebar-header">
              <h6 className="sidebar-title">Filter</h6>
              <button className="sidebar-reset" onClick={handleReset}>
                Reset
              </button>
            </div>

            <Form>
              <Form.Group className="sidebar-group">
                <Form.Label>Plant Type</Form.Label>
                <Form.Select
                  value={filters.plantType}
                  onChange={(e) =>
                    handleFilterChange("plantType", e.target.value)
                  }
                >
                  <option value="">All Types</option>
                  {PLANT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  value={filters.difficulty}
                  onChange={(e) =>
                    handleFilterChange("difficulty", e.target.value)
                  }
                >
                  <option value="">All</option>
                  {DIFFICULTIES.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group">
                <Form.Label>Light</Form.Label>
                <Form.Select
                  value={filters.light}
                  onChange={(e) => handleFilterChange("light", e.target.value)}
                >
                  <option value="">All</option>
                  {LIGHT_OPTIONS.map((light) => (
                    <option key={light} value={light}>
                      {light.charAt(0).toUpperCase() + light.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </aside>

          <div className="careposts-main">
            <div className="careposts-toolbar">
              <span className="careposts-count">
                {loading
                  ? "Loading..."
                  : `${filteredPosts.length} post${
                      filteredPosts.length !== 1 ? "s" : ""
                    } found`}
              </span>

              <Button className="create-carepost-btn" href="/careposts/new">
                + New Post
              </Button>
            </div>

            {error && (
              <div className="careposts-error">
                <p>Failed to load care posts: {error}</p>
              </div>
            )}

            {loading ? (
              <div className="careposts-loading">
                <Spinner animation="border" />
              </div>
            ) : !error && filteredPosts.length === 0 ? (
              <div className="careposts-empty">
                <p>No care posts match your filters.</p>
                <button className="sidebar-reset" onClick={handleReset}>
                  Clear filters
                </button>
              </div>
            ) : (
              <Row className="g-4">
                {filteredPosts.map((post) => (
                  <Col key={post._id} xs={12} md={6} lg={4}>
                    <CarePostCard post={post} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}