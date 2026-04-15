import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import "./ListingCard.css";

import tropicalImg from "../../assets/plants/tropical.webp";
import succulentImg from "../../assets/plants/succulent.webp";
import herbImg from "../../assets/plants/herb.webp";
import fernImg from "../../assets/plants/fern.webp";
import floweringImg from "../../assets/plants/flowering.webp";
import cactusImg from "../../assets/plants/cactus.webp";
import foliageImg from "../../assets/plants/foliage.webp";
import trailingImg from "../../assets/plants/trailing.webp";
import aquaticImg from "../../assets/plants/aquatic.webp";
import carnivorousImg from "../../assets/plants/carnivorous.webp";
import bulbImg from "../../assets/plants/bulb.webp";
import airPlantImg from "../../assets/plants/air plant.webp";
import bonsaiImg from "../../assets/plants/bonsai.webp";

const TYPE_IMAGE = {
  Tropical: tropicalImg,
  Succulent: succulentImg,
  Herb: herbImg,
  Fern: fernImg,
  Flowering: floweringImg,
  Cactus: cactusImg,
  Foliage: foliageImg,
  Trailing: trailingImg,
  Aquatic: aquaticImg,
  Carnivorous: carnivorousImg,
  Bulb: bulbImg,
  "Air Plant": airPlantImg,
  Bonsai: bonsaiImg,
};

const LISTING_BADGE = {
  free: { label: "Free", style: { background: "#e8f5e8", color: "#2c4f34" } },
  "for sale": {
    label: "For Sale",
    style: { background: "#2c4f34", color: "#f1ece4" },
  },
  rehoming: {
    label: "Rehoming",
    style: { background: "#fff3cd", color: "#664d03" },
  },
};

const CONDITION_STYLE = {
  excellent: { background: "#2c4f34", color: "#f1ece4", label: "Excellent" },
  good: { background: "#4a7c4a", color: "#fff", label: "Good" },
  fair: { background: "#b8d4b8", color: "#2c4f34", label: "Fair" },
};

const STATUS_STYLE = {
  available: { background: "#e8f5e8", color: "#2c4f34", label: "Available" },
  pending: { background: "#fff3cd", color: "#664d03", label: "Pending" },
  sold: { background: "#e9ecef", color: "#495057", label: "Sold" },
};

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackImg = TYPE_IMAGE[listing.plantType] || null;
  const listingBadge = LISTING_BADGE[listing.listingType] || {
    label: listing.listingType,
    style: { background: "#e9ecef", color: "#495057" },
  };
  const conditionStyle = CONDITION_STYLE[listing.condition] || {
    background: "#ccc",
    color: "#333",
    label: listing.condition,
  };
  const statusStyle = STATUS_STYLE[listing.status] || {
    background: "#e9ecef",
    color: "#495057",
    label: listing.status,
  };

  function goToDetail() {
    navigate(`/listings/${listing._id}`, {
      state: { from: location.pathname + location.search },
    });
  }

  return (
    <Card
      className="listing-card h-100"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${listing.plantName}`}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
    >
      <div className="listing-card-hero">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.plantName}
            className="listing-card-img"
          />
        ) : fallbackImg ? (
          <img
            src={fallbackImg}
            alt={listing.plantType}
            className="listing-card-fallback"
          />
        ) : (
          <span className="listing-card-emoji">
            {listing.plantType.charAt(0)}
          </span>
        )}
        <span
          className="listing-status-overlay"
          style={{
            background: statusStyle.background,
            color: statusStyle.color,
          }}
        >
          {statusStyle.label}
        </span>
      </div>

      <Card.Body className="listing-card-body">
        <div className="listing-card-top">
          <span className="listing-type-badge" style={listingBadge.style}>
            {listingBadge.label}
          </span>
          <span className="listing-card-price">
            {listing.price === 0 ? "Free" : `$${listing.price}`}
          </span>
        </div>

        <Card.Title className="listing-card-title">
          {listing.plantName}
        </Card.Title>

        <div className="listing-card-meta">
          <span className="listing-card-type">{listing.plantType}</span>
          <span className="listing-card-condition">{conditionStyle.label}</span>
        </div>

        <span className="listing-card-location">{listing.location}</span>
      </Card.Body>
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
