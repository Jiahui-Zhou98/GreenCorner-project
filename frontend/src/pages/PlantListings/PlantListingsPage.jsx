import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
import ListingCard from "./ListingCard.jsx";
import "./PlantListingsPage.css";

const PLANT_TYPES = [
  { value: "Tropical", hint: "warm-climate, large leaves" },
  { value: "Succulent", hint: "thick leaves, stores water" },
  { value: "Herb", hint: "basil, mint, rosemary" },
  { value: "Fern", hint: "leafy, loves shade" },
  { value: "Flowering", hint: "blooms with colorful flowers" },
  { value: "Cactus", hint: "spiny, very low water" },
  { value: "Foliage", hint: "grown for decorative leaves" },
  { value: "Trailing", hint: "hangs or cascades down" },
  { value: "Aquatic", hint: "grows in water" },
  { value: "Carnivorous", hint: "eats insects" },
  { value: "Bulb", hint: "grows from a bulb, like tulips" },
  { value: "Air Plant", hint: "no soil needed" },
  { value: "Bonsai", hint: "miniature tree art" },
];
const LISTING_TYPES = ["free", "for sale", "rehoming"];
const CONDITIONS = ["excellent", "good", "fair"];
const PAGE_SIZE = 18;

function filtersFromParams(params) {
  return {
    plantType: params.get("plantType") || "",
    listingType: params.get("listingType") || "",
    condition: params.get("condition") || "",
    maxPrice: params.get("maxPrice") || "",
    status: params.get("status") || "",
    location: params.get("location") || "",
    onlyMyPosts: params.get("onlyMyPosts") || "",
    sortBy: params.get("sortBy") || "",
  };
}

export default function PlantListingsPage() {
  const { user } = useAuth();
  const navigateTo = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const page = Number(searchParams.get("page") || 1);
  const filters = filtersFromParams(searchParams);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== "").length;
  }, [filters]);

  // Local state only for text inputs (debounced)
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const [localLocation, setLocalLocation] = useState(filters.location);
  const debounceRef = useRef(null);

  // Keep local text inputs in sync when URL changes externally (e.g. reset)
  useEffect(() => {
    setLocalMaxPrice(filters.maxPrice);
    setLocalLocation(filters.location);
  }, [filters.maxPrice, filters.location]);

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
        if (filters.location) params.set("location", filters.location);
        if (filters.onlyMyPosts) params.set("onlyMyPosts", filters.onlyMyPosts);
        if (filters.sortBy) params.set("sortBy", filters.sortBy);
        params.set("page", page);
        params.set("limit", PAGE_SIZE);

        const res = await fetch(`/api/plant-listings?${params.toString()}`, {
          credentials: "include",
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Immediately apply a filter to the URL (for selects / checkboxes)
  const applyFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        next.set("page", "1");
        return next;
      });
    },
    [setSearchParams]
  );

  // Debounced apply for text inputs (400ms)
  function applyFilterDebounced(key, value) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applyFilter(key, value), 400);
  }

  function handleReset() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLocalMaxPrice("");
    setLocalLocation("");
    setSearchParams({});
  }

  function handlePageChange(newPage) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  }

  return (
    <div className="listings-page">
      <Container className="listings-body">
        <div className="listings-header">
          <h1 className="listings-page-title">Plant Marketplace</h1>
          <p className="listings-page-sub">
            Browse plants for sale, free adoption, or rehoming in your area.
            {!user && " Sign in to create a listing or filter by your own posts."}
          </p>
        </div>
        <div className="listings-layout">
          {/* ── Mobile Filter Toggle ── */}
          <button
            type="button"
            className="filters-toggle"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            <span
              className={`filters-toggle-arrow ${filtersOpen ? "open" : ""}`}
            >
              &#9662;
            </span>
          </button>

          {/* ── Filter Sidebar ── */}
          <aside
            className={`listings-sidebar ${filtersOpen ? "sidebar-open" : ""}`}
          >
            <h2 className="sidebar-title">Filter</h2>

            <Form onSubmit={(e) => e.preventDefault()}>
              {/* Plant search filters */}
              <Form.Group className="sidebar-group" controlId="filterPlantType">
                <Form.Label>Plant Type</Form.Label>
                <Form.Select
                  value={filters.plantType}
                  onChange={(e) => applyFilter("plantType", e.target.value)}
                >
                  <option value="">All Types</option>
                  {PLANT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.value} — {t.hint}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group" controlId="filterCondition">
                <Form.Label>Plant Condition</Form.Label>
                <Form.Select
                  value={filters.condition}
                  onChange={(e) => applyFilter("condition", e.target.value)}
                >
                  <option value="">All</option>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="sidebar-group" controlId="filterMaxPrice">
                <Form.Label>Max Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  placeholder="e.g. 20"
                  value={localMaxPrice}
                  onChange={(e) => {
                    setLocalMaxPrice(e.target.value);
                    applyFilterDebounced("maxPrice", e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="sidebar-group" controlId="filterLocation">
                <Form.Label>City or area</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Boston, MA"
                  value={localLocation}
                  onChange={(e) => {
                    setLocalLocation(e.target.value);
                    applyFilterDebounced("location", e.target.value);
                  }}
                />
              </Form.Group>

              <div className="sidebar-divider"></div>

              {/* Listing type chips */}
              <div className="sidebar-group">
                <span className="sidebar-chip-label">Listing Type</span>
                <div className="sidebar-chips">
                  {LISTING_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`sidebar-chip ${filters.listingType === t ? "chip-active" : ""}`}
                      onClick={() =>
                        applyFilter(
                          "listingType",
                          filters.listingType === t ? "" : t
                        )
                      }
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status chips */}
              <div className="sidebar-group">
                <span className="sidebar-chip-label">Listing Status</span>
                <div className="sidebar-chips">
                  {["available", "pending", "sold"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`sidebar-chip ${filters.status === s ? "chip-active" : ""}`}
                      onClick={() =>
                        applyFilter("status", filters.status === s ? "" : s)
                      }
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="sidebar-reset"
                onClick={handleReset}
                aria-label="Reset all filters"
              >
                Reset filters
              </button>
            </Form>
          </aside>

          {/* ── Main Content ── */}
          <div className="listings-main">
            <div className="listings-toolbar">
              <div className="toolbar-actions">
                <span className="listings-count">
                  {loading
                    ? "Loading..."
                    : `${total} listing${total !== 1 ? "s" : ""} found`}
                </span>
                <Form.Select
                  className="toolbar-sort"
                  value={filters.sortBy}
                  onChange={(e) => applyFilter("sortBy", e.target.value)}
                  aria-label="Sort listings"
                >
                  <option value="">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </Form.Select>
                <label
                  className="toolbar-my-listings"
                  title={!user ? "Please sign in to filter your listings" : ""}
                >
                  <input
                    type="checkbox"
                    disabled={!user}
                    checked={filters.onlyMyPosts === "true"}
                    onChange={(e) =>
                      applyFilter("onlyMyPosts", e.target.checked ? "true" : "")
                    }
                  />
                  My Listings
                </label>
                <Button
                  className="btn-green create-listing-btn"
                  disabled={!user}
                  onClick={() => navigateTo("/listings/new")}
                >
                  + New Listing
                </Button>
              </div>
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
                <p className="listings-empty-title">No listings found</p>
                <p className="listings-empty-sub">
                  Try adjusting your filters or browse all plants.
                </p>
                <button
                  type="button"
                  className="sidebar-reset"
                  onClick={handleReset}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <Row className="g-4">
                  {listings.map((listing) => (
                    <Col key={listing._id} xs={12} sm={6} lg={4}>
                      <ListingCard listing={listing} />
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <nav aria-label="Listing pages" className="listings-pagination">
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
                      <span key={`ellipsis-${i}`} className="page-ellipsis">
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
