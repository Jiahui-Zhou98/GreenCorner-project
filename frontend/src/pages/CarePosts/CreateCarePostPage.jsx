import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import CarePostForm from "./CarePostForm.jsx";
import "./CreateCarePostPage.css";

  // No auth guard, unauthenticated users can navigate directly to
  // /careposts/new and see the full form. The submit will 401 on the
  // backend, but the form still renders. CreateListingPage already has
  // a guard. Add the same pattern here:
  //
  // const { user, loading } = useAuth();
  // if (!loading && !user) {
  //   return <Navigate to="/login" replace />;
  // }
  //
  // (Same issue exists in EditCarePostPage.jsx)

export default function CreateCarePostPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

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
        <button className="cpf-back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="carepost-form-title">New Care Post</h1>

        <p className="carepost-form-subtitle">
          Share your plant care experience, tips, and helpful advice with the
          community.
        </p>

        {serverError && <div className="cpf-server-error">{serverError}</div>}

        <CarePostForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Publish Post"
        />
      </Container>
    </div>
  );
}
