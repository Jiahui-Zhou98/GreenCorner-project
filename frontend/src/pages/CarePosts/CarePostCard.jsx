import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./CarePostCard.css";

export default function CarePostCard({ post }) {
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

CarePostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    plantType: PropTypes.string,
    difficulty: PropTypes.string,
    content: PropTypes.string,
    light: PropTypes.string,
    watering: PropTypes.string,
    author: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
};