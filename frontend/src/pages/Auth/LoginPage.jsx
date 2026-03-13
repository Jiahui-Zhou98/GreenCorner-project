import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
import "./AuthPages.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (serverError) setServerError(null);
  }

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password) e.password = "Password is required.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      await login(form.email.trim(), form.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <Container className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your GreenCorner account</p>

          {serverError && <div className="auth-error">{serverError}</div>}

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="auth-group">
              <Form.Label className="auth-label">Email</Form.Label>
              <Form.Control
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="auth-group">
              <Form.Label className="auth-label">Password</Form.Label>
              <InputGroup>
                <Form.Control
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  isInvalid={!!errors.password}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              className="btn-green auth-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-switch-link">
              Register here
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
