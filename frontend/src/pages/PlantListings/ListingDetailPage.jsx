import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Spinner, Badge, Modal } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
import "./ListingDetailPage.css";

const TYPE_EMOJI = {
  Tropical: "🌿",
  Succulent: "🪴",
  Herb: "🌾",
  Fern: "🍀",
  Flowering: "🌸",
  Cactus: "🌵",
  Foliage: "🍃",
  Trailing: "🪝",
  Aquatic: "💧",
  Carnivorous: "🪲",
  Bulb: "🌷",
  "Air Plant": "🌬️",
  Bonsai: "🎋",
};

const LISTING_BADGE = {
  free: { bg: "success", label: "Free" },
  "for sale": { bg: "primary", label: "For Sale" },
  rehoming: { bg: "warning", label: "Rehoming" },
};

const CONDITION_STYLE = {
  excellent: { background: "#2c4f34", color: "#f1ece4", label: "Excellent" },
  good: { background: "#6a9e6a", color: "#fff", label: "Good" },
  fair: { background: "#b8d4b8", color: "#2c4f34", label: "Fair" },
};

const STATUS_STYLE = {
  available: { background: "#e8f5e8", color: "#2c4f34", label: "Available" },
  pending: { background: "#fff3cd", color: "#856404", label: "Pending" },
  sold: { background: "#e9ecef", color: "#6c757d", label: "Sold" },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const backTo = location.state?.from || "/listings";

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      try {
        const res = await fetch(`/api/plant-listings/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Error ${res.status}`);
        }
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/plant-listings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      navigate("/listings");
    } catch (err) {
      console.error("Failed to delete:", err.message);
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="detail-loading">
        <Spinner animation="border" style={{ color: "#2c4f34" }} />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="detail-error">
        <p>Failed to load listing: {error}</p>
        <Button
          className="btn-green detail-back-btn"
          onClick={() => navigate("/listings")}
        >
          Back to Listings
        </Button>
      </Container>
    );
  }

  if (!listing) return null;

  const emoji = TYPE_EMOJI[listing.plantType] || "🌱";
  const listingBadge = LISTING_BADGE[listing.listingType] || {
    bg: "secondary",
    label: listing.listingType,
  };
  const conditionStyle = CONDITION_STYLE[listing.condition] || {
    background: "#ccc",
    color: "#333",
    label: listing.condition,
  };
  const statusStyle = STATUS_STYLE[listing.status] || {
    background: "#e9ecef",
    color: "#6c757d",
    label: listing.status,
  };

  return (
    <div className="detail-page">
      <Container className="detail-container">
        {/* Back link */}
        <button className="detail-back-link" onClick={() => navigate(backTo)}>
          ← Back to Listings
        </button>

        <div className="detail-layout">
          {/* Left — Hero */}
          <div className="detail-hero-col">
            <div className="detail-hero">
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.plantName}
                  className="detail-hero-img"
                />
              ) : (
                <span className="detail-hero-emoji">{emoji}</span>
              )}
            </div>

            {/* Seller card */}
            <div className="detail-seller-card">
              <p className="detail-seller-label">Listed by</p>
              <p className="detail-seller-name">{listing.sellerName}</p>
              <a
                className="detail-seller-email"
                href={`mailto:${listing.sellerEmail}`}
              >
                {listing.sellerEmail}
              </a>
            </div>
          </div>

          {/* Right — Info */}
          <div className="detail-info-col">
            {/* Badges */}
            <div className="detail-badges">
              <Badge bg={listingBadge.bg} className="me-2">
                {listingBadge.label}
              </Badge>
              <span
                className="detail-badge-custom me-2"
                style={{
                  background: conditionStyle.background,
                  color: conditionStyle.color,
                }}
              >
                {conditionStyle.label}
              </span>
              <span
                className="detail-badge-custom"
                style={{
                  background: statusStyle.background,
                  color: statusStyle.color,
                }}
              >
                {statusStyle.label}
              </span>
            </div>

            <h1 className="detail-title">{listing.plantName}</h1>
            <p className="detail-type">{listing.plantType}</p>

            {/* Price */}
            <p className="detail-price">
              {listing.price === 0 ? "Free" : `$${listing.price}`}
            </p>

            {/* Description */}
            <div className="detail-section">
              <h2 className="detail-section-title">About this plant</h2>
              <p className="detail-description">{listing.description}</p>
            </div>

            {/* Meta grid */}
            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <span className="detail-meta-label">Location</span>
                <span className="detail-meta-value">{listing.location}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Listed on</span>
                <span className="detail-meta-value">
                  {formatDate(listing.createdAt)}
                </span>
              </div>
              {listing.tags && listing.tags.length > 0 && (
                <div className="detail-meta-item detail-meta-tags">
                  <span className="detail-meta-label">Tags</span>
                  <div className="detail-tags">
                    {listing.tags.map((tag) => (
                      <span key={tag} className="detail-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions — only visible to the listing creator */}
            {user && user._id === listing.createdBy && (
              <div className="detail-actions">
                <Button
                  className="btn-green detail-edit-btn"
                  onClick={() => navigate(`/listings/${id}/edit`)}
                >
                  Edit Listing
                </Button>
                <Button
                  className="detail-delete-btn"
                  onClick={() => setShowConfirm(true)}
                >
                  Delete Listing
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Delete confirmation modal */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
        className="detail-confirm-modal"
      >
        <Modal.Body className="detail-modal-body">
          <div className="detail-modal-icon">🗑️</div>
          <h5 className="detail-modal-title">Delete this listing?</h5>
          <p className="detail-modal-text">
            <strong>{listing?.plantName}</strong> will be permanently removed.
            This action cannot be undone.
          </p>
          <div className="detail-modal-actions">
            <button
              className="detail-modal-cancel"
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="detail-modal-confirm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
