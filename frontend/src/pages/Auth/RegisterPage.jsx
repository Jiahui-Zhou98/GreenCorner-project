import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { useAuth } from "../../context/useAuth.js";
import "./AuthPages.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
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
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/login", { replace: true });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <Container className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join GreenCorner and start sharing your plants
          </p>

          {serverError && <div className="auth-error">{serverError}</div>}

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="auth-group">
              <Form.Label className="auth-label">Name</Form.Label>
              <Form.Control
                className="auth-input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

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
                  placeholder="At least 6 characters"
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

            <Form.Group className="auth-group">
              <Form.Label className="auth-label">Confirm Password</Form.Label>
              <InputGroup>
                <Form.Control
                  className="auth-input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirm((p) => !p)}
                  tabIndex={-1}
                >
                  {showConfirm ? (
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
                  {errors.confirmPassword}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </Form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-switch-link">
              Sign in here
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
