import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
import ListingForm from "./ListingForm.jsx";
import "./CreateListingPage.css";

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/plant-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Server error ${res.status}`);
      }
      const created = await res.json();
      navigate(`/listings/${created._id}`, { replace: true });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="listing-form-page">
      <Container className="listing-form-container">
        <button className="lf-back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="listing-form-title">New Listing</h1>
        <p className="listing-form-subtitle">
          Fill in the details below to list your plant in the community
          marketplace.
        </p>

        {serverError && <div className="lf-server-error">{serverError}</div>}

        <ListingForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Create Listing"
        />
      </Container>
    </div>
  );
}
