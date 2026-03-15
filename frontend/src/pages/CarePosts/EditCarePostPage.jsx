import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import CarePostForm from "./CarePostForm.jsx";
import "./PostPageLayout.css";

export default function EditCarePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/careposts/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Error ${res.status}`);
        }

        const data = await res.json();

        setInitialValues({
          title: data.title || "",
          plantType: data.plantType || "",
          difficulty: data.difficulty || "easy",
          light: data.light || "",
          watering: data.watering || "",
          content: data.content || "",
          author: data.author || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  async function handleSubmit(payload) {
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch(`/api/careposts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Server error ${res.status}`);
      }

      navigate(`/careposts/${id}`, { replace: true });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="carepost-form-loading">
        <Spinner animation="border" style={{ color: "#2c4f34" }} />
      </div>
    );
  }

  if (loadError) {
    return (
      <Container className="carepost-form-container">
        <p className="cpf-server-error">Failed to load post: {loadError}</p>
        <button className="cpf-back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </Container>
    );
  }

  return (
    <div className="carepost-form-page">
      <Container className="carepost-form-container">
        <button
          className="cpf-back-link"
          onClick={() => navigate(`/careposts/${id}`)}
        >
          ← Back to Post
        </button>

        <h1 className="carepost-form-title">Edit Care Post</h1>

        <p className="carepost-form-subtitle">
          Update your plant care guide and save your changes.
        </p>

        {serverError && <div className="cpf-server-error">{serverError}</div>}

        <CarePostForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save Changes"
        />
      </Container>
    </div>
  );
}
