import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Spinner, Badge, Modal } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js"; 
import "./CarePostDetailPage.css";

const DIFFICULTY_STYLE = {
  easy: { bg: "success", label: "Easy" },
  medium: { bg: "warning", label: "Medium" },
  hard: { bg: "danger", label: "Hard" },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CarePostDetailPage() {
  const { user } = useAuth(); 
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = location.state?.from || "/careposts";

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const res = await fetch(`/api/careposts/${id}`);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Error ${res.status}`);
        }

        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);

    try {
      const res = await fetch(`/api/careposts/${id}`, {
        method: "DELETE",
        // ADD THIS LINE:
        credentials: "include", 
      });

      if (!res.ok) {
        const data = await res.json();
        // This will tell you exactly why the server said no
        throw new Error(data.error || `Delete failed: ${res.status}`);
      }

      navigate("/careposts");
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert(err.message); // Temporarily alert the error to see what's happening
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="carepost-detail-loading">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="carepost-detail-error">
        <p>Failed to load post: {error}</p>
        <Button onClick={() => navigate("/careposts")}>
          Back to Care Posts
        </Button>
      </Container>
    );
  }

  if (!post) return null;

  const difficulty = DIFFICULTY_STYLE[post.difficulty] || {
    bg: "secondary",
    label: post.difficulty,
  };

  return (
    <div className="carepost-detail-page">
      <Container className="carepost-detail-container">
        <button
          className="carepost-back-link"
          onClick={() => navigate(backTo)}
        >
          ← Back to Care Posts
        </button>

        <div className="carepost-detail-layout">
          {/* Hero image */}
          <div className="carepost-detail-hero">
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="carepost-detail-img"
              />
            ) : (
              <div className="carepost-detail-placeholder">🌿</div>
            )}
          </div>

          {/* Content */}
          <div className="carepost-detail-info">
            <div className="carepost-detail-badges">
              <Badge bg={difficulty.bg}>{difficulty.label}</Badge>
            </div>

            <h1 className="carepost-detail-title">{post.title}</h1>
            <p className="carepost-detail-type">{post.plantType}</p>

            <div className="carepost-detail-meta">
              <div>
                <span className="meta-label">Light</span>
                <span className="meta-value">{post.light}</span>
              </div>
              <div>
                <span className="meta-label">Watering</span>
                <span className="meta-value">{post.watering}</span>
              </div>
              <div>
                <span className="meta-label">Posted</span>
                <span className="meta-value">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>

            <div className="carepost-detail-section">
              <h2>Care Guide</h2>
              <p>{post.content}</p>
            </div>

            <div className="carepost-detail-author">
              Written by <strong>{post.author}</strong>
            </div>

            {user && String(user._id) === String(post.createdBy) && (
              <div className="carepost-detail-actions">
                <Button
                  className="carepost-edit-btn"
                  onClick={() => navigate(`/careposts/${id}/edit`)}
                >
                  Edit Post
                </Button>

                <Button
                  className="carepost-delete-btn"
                  onClick={() => setShowConfirm(true)}
                >
                  Delete Post
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Delete Modal stays the same */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Body className="carepost-modal-body">
          <div className="carepost-modal-icon">🗑️</div>
          <h5>Delete this post?</h5>
          <p>
            <strong>{post.title}</strong> will be permanently removed.
          </p>
          <div className="carepost-modal-actions">
            <button
              className="modal-cancel-btn"
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="modal-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}