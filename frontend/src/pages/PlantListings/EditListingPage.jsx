import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import ListingForm from "./ListingForm.jsx";
import "./ListingPageLayout.css";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/plant-listings/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Error ${res.status}`);
        }
        const data = await res.json();
        setInitialValues({
          plantName: data.plantName || "",
          plantType: data.plantType || "",
          description: data.description || "",
          condition: data.condition || "good",
          listingType: data.listingType || "for sale",
          price: data.price != null ? String(data.price) : "",
          location: data.location || "",
          status: data.status || "available",
          sellerName: data.sellerName || "",
          sellerEmail: data.sellerEmail || "",
          imageUrl: data.imageUrl || "",
          tags: data.tags || [],
        });
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/plant-listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Server error ${res.status}`);
      }
      navigate(`/listings/${id}`, { replace: true });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="listing-form-loading">
        <Spinner animation="border" style={{ color: "#2c4f34" }} />
      </div>
    );
  }

  if (loadError) {
    return (
      <Container className="listing-form-container">
        <p className="lf-server-error">Failed to load listing: {loadError}</p>
        <button className="lf-back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </Container>
    );
  }

  return (
    <div className="listing-form-page">
      <Container className="listing-form-container">
        <button
          className="lf-back-link"
          onClick={() => navigate(`/listings/${id}`)}
        >
          ← Back to Listing
        </button>
        <h1 className="listing-form-title">Edit Listing</h1>
        <p className="listing-form-subtitle">
          Update the details below. Changes will be saved immediately.
        </p>

        {serverError && <div className="lf-server-error">{serverError}</div>}

        <ListingForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save Changes"
          showStatus
        />
      </Container>
    </div>
  );
}
