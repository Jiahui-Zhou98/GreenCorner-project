import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
import CarePostCard from "./CarePostCard.jsx";
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
    onlyMyPosts: params.get("onlyMyPosts") === "true",
  };
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

        if (currentFilters.onlyMyPosts) params.set("onlyMyPosts", "true");

        params.set("page", currentPage);
        params.set("limit", PAGE_SIZE);

        const res = await fetch(`/api/careposts?${params.toString()}`, {
          credentials: "include",
        });
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

    setTimeout(() => {
      document.getElementById("main-content")?.focus();
    }, 100);
  }

  return (
    <div className="careposts-page">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Container className="careposts-body">
        <div className="careposts-layout">
          {/* Sidebar */}
          <aside className="careposts-sidebar">
            <div className="sidebar-header">
              <h6 className="sidebar-title">Filter</h6>

              <button 
              className="sidebar-reset" 
                onClick={handleReset}
                aria-label="Reset all filters"
              >
                Reset
              </button>
            </div>

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleApply();
              }}
            >
              <Form.Group className="sidebar-group" controlId="filter-plant-type">
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

              <Form.Group className="sidebar-group" controlId="filter-difficulty">
                <Form.Label>Care Difficulty</Form.Label>
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

              <Form.Group className="sidebar-group" controlId="filter-light">
                <Form.Label>Sunlight Needs</Form.Label>
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

              <Form.Group className="sidebar-group mb-3">
                <Form.Check
                  type="checkbox"
                  id="filterMyPosts"
                  label="My Posts"
                  disabled={!user}
                  checked={pending.onlyMyPosts}
                  onChange={(e) =>
                    handlePendingChange("onlyMyPosts", e.target.checked)
                  }
                  className={!user ? "text-muted" : ""}
                />
              </Form.Group>

              <button type="submit" className="sidebar-apply">
                Apply Filters
              </button>
            </Form>
          </aside>

          {/* Main Content Area */}
          <div 
            className="careposts-main"
            id="main-content"
            tabIndex="-1"
          >
            <div className="careposts-toolbar">
              <span className="careposts-count" aria-live="polite">
                {loading
                  ? "Loading..."
                  : `${total} post${total !== 1 ? "s" : ""} found`}
              </span>

              <Button
                className="btn-green create-carepost-btn"
                disabled={!user}
                aria-disabled={!user}
                aria-label={
                  user
                    ? "Create a new care post"
                    : "Sign in required to create a care post"
                }
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
              <div className="careposts-loading" aria-live="polite">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading careposts...</span>
                </Spinner>
              </div>
            ) : posts.length === 0 ? (
              <div className="careposts-empty">
                <p>No care posts match your filters.</p>
                <button className="sidebar-reset" onClick={handleReset} aria-label="Clear all filters">
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
              <nav aria-label="Carepost pages" className="careposts-pagination">
                <button
                  className="page-btn"
                  disabled={page === 1}
                  aria-label="Previous page"
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
                      <span key={`ellipsis-${i}`} className="page-ellipsis" aria-label="More pages"> 
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        className={`page-btn ${page === item ? "active" : ""}`}
                        aria-label={`Page ${item}`}
                        aria-current={page === item ? "page" : undefined}
                        onClick={() => handlePageChange(item)}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  className="page-btn"
                  disabled={page === totalPages}
                  aria-label="Next page"
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
