import { useNavigate, Navigate } from "react-router-dom";
import { Container, Button, Spinner } from "react-bootstrap";
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
        <div className="dash-card">
          <div className="dash-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h1 className="dash-name">{user.name}</h1>
          <p className="dash-email">{user.email}</p>

          <div className="dash-actions">
            <Button
              className="btn-green dash-btn"
              onClick={() => navigate("/careposts")}
            >
              View Care Posts
            </Button>
            <Button
              className="btn-green dash-btn"
              onClick={() => navigate("/listings")}
            >
              View Market Listings
            </Button>
          </div>

          <button className="dash-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </Container>
    </div>
  );
}
