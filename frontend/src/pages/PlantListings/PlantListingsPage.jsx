import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import ListingCard from "./ListingCard.jsx";
import "./PlantListingsPage.css";

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
const LISTING_TYPES = ["free", "for sale", "rehoming"];
const CONDITIONS = ["excellent", "good", "fair"];
const PAGE_SIZE = 18;

const DEFAULT_FILTERS = {
  plantType: "",
  listingType: "",
  condition: "",
  maxPrice: "",
  status: "",
};

export default function PlantListingsPage() {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        setError(null);
        const params = new URLSearchParams();
        if (filters.plantType) params.set("plantType", filters.plantType);
        if (filters.listingType) params.set("listingType", filters.listingType);
        if (filters.condition) params.set("condition", filters.condition);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (filters.status) params.set("status", filters.status);
        params.set("page", page);
        params.set("limit", PAGE_SIZE);

        const res = await fetch(`/api/plant-listings?${params.toString()}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setListings(data.listings ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [filters, page]);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  return (
    <div className="listings-page">
      <Container className="listings-body">
        <div className="listings-layout">
          {/* ── Filter Sidebar ── */}
          <aside className="listings-sidebar">
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
                  {PLANT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group">
                <Form.Label>Listing Type</Form.Label>
                <Form.Select
                  value={filters.listingType}
                  onChange={(e) =>
                    handleFilterChange("listingType", e.target.value)
                  }
                >
                  <option value="">All</option>
                  {LISTING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group">
                <Form.Label>Condition</Form.Label>
                <Form.Select
                  value={filters.condition}
                  onChange={(e) =>
                    handleFilterChange("condition", e.target.value)
                  }
                >
                  <option value="">All</option>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group">
                <Form.Label>Max Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  placeholder="e.g. 20"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="sidebar-group">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </aside>

          {/* ── Main Content ── */}
          <div className="listings-main">
            <div className="listings-toolbar">
              <span className="listings-count">
                {loading
                  ? "Loading..."
                  : `${total} listing${total !== 1 ? "s" : ""} found`}
              </span>
              <Button className="create-listing-btn" href="/listings/new">
                + New Listing
              </Button>
            </div>

            {error && (
              <div className="listings-error">
                <p>Failed to load listings: {error}</p>
              </div>
            )}

            {loading ? (
              <div className="listings-loading">
                <Spinner animation="border" />
              </div>
            ) : !error && listings.length === 0 ? (
              <div className="listings-empty">
                <p>No listings match your filters.</p>
                <button className="sidebar-reset" onClick={handleReset}>
                  Clear filters
                </button>
              </div>
            ) : (
              <Row className="g-4">
                {listings.map((listing) => (
                  <Col key={listing._id} xs={12} sm={6} lg={4}>
                    <ListingCard listing={listing} />
                  </Col>
                ))}
              </Row>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="listings-pagination">
                <button
                  className="page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
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
                        onClick={() => setPage(item)}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  className="page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
