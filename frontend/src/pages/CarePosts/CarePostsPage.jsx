import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
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
const LIGHT_OPTIONS = [
  "Bright Indirect",
  "Low Light",
  "Direct Sunlight",
  "Partial Shade",
];
const PAGE_SIZE = 6;

function filtersFromParams(params) {
  return {
    plantType: params.get("plantType") || "",
    difficulty: params.get("difficulty") || "",
    light: params.get("light") || "",
  };
}

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
            className="btn-green carepost-detail-btn"
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const [pending, setPending] = useState(() => filtersFromParams(searchParams));
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentFilters = filtersFromParams(searchParams);
    const currentPage = Number(searchParams.get("page") || 1);

    async function fetchPosts() {
      setLoading(true);
      try {
        setError(null);
        const params = new URLSearchParams();
        if (currentFilters.plantType)
          params.set("plantType", currentFilters.plantType);
        if (currentFilters.difficulty)
          params.set("difficulty", currentFilters.difficulty);
        if (currentFilters.light) params.set("light", currentFilters.light);
        params.set("page", currentPage);
        params.set("limit", PAGE_SIZE);

        const res = await fetch(`/api/careposts?${params.toString()}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        setPosts(data.posts ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch care posts:", err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [searchParams]);

  function handlePendingChange(key, value) {
    setPending((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(pending).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      next.set("page", "1");
      return next;
    });
  }

  function handleReset() {
    setPending(filtersFromParams(new URLSearchParams()));
    setSearchParams({});
  }

  function handlePageChange(newPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="careposts-page">
      <Container className="careposts-body">
        <div className="careposts-layout">
          {/* Sidebar */}
          <aside className="careposts-sidebar">
            <div className="sidebar-header">
              <h6 className="sidebar-title">Filter</h6>
              <button className="sidebar-reset" onClick={handleReset}>
                Reset
              </button>
            </div>
            <Form>
              {/* ... All your Form Groups stay here ... */}
              <Form.Group className="sidebar-group">
                <Form.Label>Plant Type</Form.Label>
                <Form.Select
                  value={pending.plantType}
                  onChange={(e) =>
                    handlePendingChange("plantType", e.target.value)
                  }
                >
                  <option value="">All Types</option>
                  {PLANT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  value={pending.difficulty}
                  onChange={(e) =>
                    handlePendingChange("difficulty", e.target.value)
                  }
                >
                  <option value="">All</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group">
                <Form.Label>Light</Form.Label>
                <Form.Select
                  value={pending.light}
                  onChange={(e) => handlePendingChange("light", e.target.value)}
                >
                  <option value="">All</option>
                  {LIGHT_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <button
                type="button"
                className="sidebar-apply"
                onClick={handleApply}
              >
                Apply Filters
              </button>
            </Form>
          </aside>
          {/* Main Content Area */}
          <div className="careposts-main">
            <div className="careposts-toolbar">
              <span className="careposts-count">
                {loading
                  ? "Loading..."
                  : `${total} post${total !== 1 ? "s" : ""} found`}
              </span>

              <Button
                className="btn-green create-carepost-btn"
                disabled={!user}
                title={!user ? "Please sign in to create a care post" : ""}
                onClick={() => navigate("/careposts/new")}
              >
                + New Care Post
              </Button>
            </div>{" "}
            {/* END TOOLBAR */}
            {error && (
              <div className="careposts-error">
                <p>Failed to load posts: {error}</p>
              </div>
            )}
            {loading ? (
              <div className="careposts-loading">
                <Spinner animation="border" />
              </div>
            ) : posts.length === 0 ? (
              <div className="careposts-empty">
                <p>No care posts match your filters.</p>
                <button className="sidebar-reset" onClick={handleReset}>
                  Clear filters
                </button>
              </div>
            ) : (
              <Row className="g-4">
                {posts.map((post) => (
                  <Col key={post._id} xs={12} md={6} lg={4}>
                    <CarePostCard post={post} />
                  </Col>
                ))}
              </Row>
            )}
            {/* Pagination Section */}
            {totalPages > 1 && !loading && (
              <div className="careposts-pagination">
                <button
                  className="page-btn"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 2
                  )
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "..." ? (
                      <span key={`ellipsis-${i}`} className="page-ellipsis">
                        …
                      </span>
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
          </div>{" "}
          {/* END MAIN CONTENT */}
        </div>{" "}
        {/* END LAYOUT */}
      </Container>
    </div>
  );
}
