import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Button } from "react-bootstrap";

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

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
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
    <Card className="listing-card h-100">
      <div className="listing-card-hero">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.plantName}
            className="listing-card-img"
          />
        ) : (
          <span className="listing-card-emoji">{emoji}</span>
        )}
      </div>

      <Card.Body className="listing-card-body">
        <div className="listing-card-badges mb-2">
          <Badge bg={listingBadge.bg} className="me-1">
            {listingBadge.label}
          </Badge>
          <span
            className="listing-badge-condition me-1"
            style={{
              background: conditionStyle.background,
              color: conditionStyle.color,
            }}
          >
            {conditionStyle.label}
          </span>
          <span
            className="listing-badge-condition"
            style={{
              background: statusStyle.background,
              color: statusStyle.color,
            }}
          >
            {statusStyle.label}
          </span>
        </div>

        <Card.Title className="listing-card-title">
          {listing.plantName}
        </Card.Title>

        <p className="listing-card-type">{listing.plantType}</p>

        <p className="listing-card-desc">{listing.description}</p>

        <div className="listing-card-meta">
          <span className="listing-card-price">
            {listing.price === 0 ? "Free" : `$${listing.price}`}
          </span>
          <span className="listing-card-location">{listing.location}</span>
        </div>
      </Card.Body>

      <Card.Footer className="listing-card-footer">
        <Button
          className="listing-detail-btn w-100"
          onClick={() => navigate(`/listings/${listing._id}`)}
        >
          View Details
        </Button>
      </Card.Footer>
    </Card>
  );
}

ListingCard.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    plantName: PropTypes.string.isRequired,
    plantType: PropTypes.string.isRequired,
    description: PropTypes.string,
    condition: PropTypes.string,
    listingType: PropTypes.string.isRequired,
    price: PropTypes.number,
    location: PropTypes.string,
    status: PropTypes.string,
    sellerName: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
};
