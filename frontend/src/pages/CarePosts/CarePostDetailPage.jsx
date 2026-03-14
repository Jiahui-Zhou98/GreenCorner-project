import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Form, Button } from "react-bootstrap";
import "./CarePostsPage.css";

export default function CarePostsPage() {
  // --- State Management ---
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Active filters (Applied to the API call)
  const [filters, setFilters] = useState({
    light: "",
    difficulty: "",
    plantType: "",
  });

  // Temporary filters (Changes as user selects options, but not yet applied)
  const [tempFilters, setTempFilters] = useState({
    light: "",
    difficulty: "",
    plantType: "",
  });

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page,
          limit: 12,
          light: filters.light,
          difficulty: filters.difficulty,
          plantType: filters.plantType,
        }).toString();

        const res = await fetch(`/api/careposts?${query}`);
        const data = await res.json();

        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page, filters]); // Re-fetch only when page or active filters change

  // --- Event Handlers ---
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setPage(1); // Reset to first page when applying new filters
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <Container className="py-5 careposts-page">
      <h1 className="mb-4 fw-bold" style={{ color: "#2c4f34" }}>Plant Care Guides</h1>

      {/* --- Filter Section --- */}
      <div className="filter-bar p-4 mb-5 rounded shadow-sm bg-white">
        <Row className="align-items-end g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Light Level</Form.Label>
              <Form.Select
                value={tempFilters.light}
                onChange={(e) => setTempFilters({ ...tempFilters, light: e.target.value })}
              >
                <option value="">All Light Levels</option>
                <option value="Bright Indirect">Bright Indirect</option>
                <option value="Low Light">Low Light</option>
                <option value="Direct Sunlight">Direct Sunlight</option>
                <option value="Partial Shade">Partial Shade</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Difficulty</Form.Label>
              <Form.Select
                value={tempFilters.difficulty}
                onChange={(e) => setTempFilters({ ...tempFilters, difficulty: e.target.value })}
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold">Plant Type</Form.Label>
              <Form.Select
                value={tempFilters.plantType}
                onChange={(e) => setTempFilters({ ...tempFilters, plantType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Tropical">Tropical</option>
                <option value="Succulent">Succulent</option>
                <option value="Cactus">Cactus</option>
                <option value="Fern">Fern</option>
                <option value="Bonsai">Bonsai</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Button className="w-100 btn-green-apply" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </Col>
        </Row>
      </div>

      {/* --- Posts Grid --- */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <Row className="g-4">
          {posts.map((post) => (
            <Col key={post._id} xs={12} sm={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm post-card">
                <Card.Body>
                  <div className="mb-2">
                    <span className={`badge-difficulty ${post.difficulty}`}>
                      {post.difficulty}
                    </span>
                  </div>
                  <Card.Title className="fw-bold">{post.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {post.content.substring(0, 100)}...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="small text-secondary">By {post.author}</span>
                    <Link to={`/careposts/${post._id}`} className="btn-read-more">
                      Read More
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* --- Pagination --- */}
      {totalPages > 1 && !loading && (
        <div className="listings-pagination mt-5">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, i) =>
              item === "..." ? (
                <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
              ) : (
                <button
                  key={item}
                  className={`page-btn ${page === item ? "active" : ""}`}
                  onClick={() => handlePageChange(item)}
                >
                  {item}
                </button>
              )
            )}

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </Container>
  );
}