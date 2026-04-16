import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
import CarePostForm from "./CarePostForm.jsx";
import "./CreateCarePostPage.css";

export default function CreateCarePostPage() {
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
      const res = await fetch("/api/careposts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Server error ${res.status}`);
      }

      const created = await res.json();
      navigate(`/careposts/${created._id}`, { replace: true });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="carepost-form-page">
      <Container className="carepost-form-container">
        <button className="cpf-back-link" onClick={() => navigate(-1)} aria-label="Go back to previous page">
          ← Back
        </button>

        <h1 className="carepost-form-title">New Care Post</h1>

        <p className="carepost-form-subtitle">
          Share your plant care experience, tips, and helpful advice with the
          community.
        </p>

        {serverError && (
          <div className="cpf-server-error" role="alert">
            {serverError}
          </div>
        )}

        <CarePostForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Publish Post"
        />
      </Container>
    </div>
  );
}
