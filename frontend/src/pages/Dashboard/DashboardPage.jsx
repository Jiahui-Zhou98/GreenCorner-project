import { useNavigate, Navigate, Link } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="dash-loading">
        <Spinner animation="border" style={{ color: "#2c4f34" }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="dash-page">
      <Container className="dash-container">
        {/* Profile header */}
        <div className="dash-header">
          <div className="dash-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="dash-user-info">
            <h1 className="dash-name">{user.name}</h1>
            <p className="dash-email">{user.email}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="dash-sections">
          <div className="dash-section">
            <div className="dash-section-top">
              <h2 className="dash-section-title">My Care Guides</h2>
              <Link to="/careposts/new" className="dash-create-link">
                + New Guide
              </Link>
            </div>
            <p className="dash-section-desc">
              Care tips and grow guides you have written for the community.
            </p>
            <Link to="/careposts?onlyMyPosts=true" className="dash-view-link">
              View my care guides
            </Link>
          </div>

          <div className="dash-section">
            <div className="dash-section-top">
              <h2 className="dash-section-title">My Plant Listings</h2>
              <Link to="/listings/new" className="dash-create-link">
                + New Listing
              </Link>
            </div>
            <p className="dash-section-desc">
              Plants you have posted for sale, free adoption, or rehoming.
            </p>
            <Link to="/listings?onlyMyPosts=true" className="dash-view-link">
              View my listings
            </Link>
          </div>
        </div>

        <button className="dash-logout" onClick={handleLogout}>
          Sign out
        </button>
      </Container>
    </div>
  );
}
