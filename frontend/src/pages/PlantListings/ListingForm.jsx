import { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import "./ListingForm.css";

const PLANT_TYPES = [
  "Tropical",
  "Succulent",
  "Herb",
  "Fern",
  "Flowering",
  "Cactus",
  "Foliage",
  "Trailing",
  "Aquatic",
  "Carnivorous",
  "Bulb",
  "Air Plant",
  "Bonsai",
];
const CONDITIONS = ["excellent", "good", "fair"];
const LISTING_TYPES = ["free", "for sale", "rehoming"];
const STATUSES = ["available", "pending", "sold"];
const TAGS_POOL = [
  "low-maintenance",
  "beginner-friendly",
  "pet-safe",
  "air-purifying",
  "fast-growing",
  "rare",
  "drought-tolerant",
  "shade-loving",
  "sun-loving",
  "edible",
  "fragrant",
  "trailing",
];

const EMPTY_FORM = {
  plantName: "",
  plantType: "",
  description: "",
  condition: "good",
  listingType: "for sale",
  price: "",
  location: "",
  status: "available",
  sellerName: "",
  sellerEmail: "",
  imageUrl: "",
  tags: [],
};

export default function ListingForm({
  initialValues = {},
  onSubmit,
  submitting = false,
  submitLabel = "Submit",
  showStatus = false,
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [showUrlInput, setShowUrlInput] = useState(false);

  function set(key, value) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "listingType" && value === "free") next.price = "0";
      return next;
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function toggleTag(tag) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }

  function validate() {
    const e = {};
    if (!form.plantName.trim()) e.plantName = "Plant name is required.";
    if (!form.plantType) e.plantType = "Please select a plant type.";
    if (!form.listingType) e.listingType = "Please select a listing type.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.sellerName.trim()) e.sellerName = "Seller name is required.";
    if (!form.sellerEmail.trim()) e.sellerEmail = "Seller email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.sellerEmail))
      e.sellerEmail = "Please enter a valid email address.";
    if (
      form.listingType !== "free" &&
      form.price !== "" &&
      Number(form.price) < 0
    )
      e.price = "Price cannot be negative.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }

    const payload = {
      plantName: form.plantName.trim(),
      plantType: form.plantType,
      description: form.description.trim(),
      condition: form.condition,
      listingType: form.listingType,
      price: form.listingType === "free" ? 0 : Number(form.price) || 0,
      location: form.location.trim(),
      sellerName: form.sellerName.trim(),
      sellerEmail: form.sellerEmail.trim(),
      imageUrl: form.imageUrl.trim() || null,
      tags: form.tags,
      ...(showStatus && { status: form.status }),
    };
    onSubmit(payload);
  }

  const isFree = form.listingType === "free";

  return (
    <Form noValidate onSubmit={handleSubmit} className="listing-form">
      {/* Plant name */}
      <Form.Group className="lf-group" controlId="lfPlantName">
        <Form.Label className="lf-label">
          Plant Name <span className="lf-required">*</span>
        </Form.Label>
        <Form.Control
          className="lf-input"
          placeholder="e.g. Monstera Deliciosa"
          value={form.plantName}
          onChange={(e) => set("plantName", e.target.value)}
          isInvalid={!!errors.plantName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.plantName}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Plant type + condition */}
      <Row className="g-3">
        <Col md={6}>
          <Form.Group className="lf-group" controlId="lfPlantType">
            <Form.Label className="lf-label">
              Plant Type <span className="lf-required">*</span>
            </Form.Label>
            <Form.Select
              className="lf-input"
              value={form.plantType}
              onChange={(e) => set("plantType", e.target.value)}
              isInvalid={!!errors.plantType}
            >
              <option value="">Select a type…</option>
              {PLANT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.plantType}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="lf-group" controlId="lfCondition">
            <Form.Label className="lf-label">Condition</Form.Label>
            <Form.Select
              className="lf-input"
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Description */}
      <Form.Group className="lf-group" controlId="lfDescription">
        <Form.Label className="lf-label">Description</Form.Label>
        <Form.Control
          as="textarea"
          className="lf-input lf-textarea"
          rows={5}
          placeholder="Describe the plant's history, care routine, and current condition…"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Form.Group>

      {/* Listing type + price */}
      <Row className="g-3">
        <Col md={6}>
          <Form.Group className="lf-group" controlId="lfListingType">
            <Form.Label className="lf-label">
              Listing Type <span className="lf-required">*</span>
            </Form.Label>
            <Form.Select
              className="lf-input"
              value={form.listingType}
              onChange={(e) => set("listingType", e.target.value)}
              isInvalid={!!errors.listingType}
            >
              {LISTING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.listingType}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="lf-group" controlId="lfPrice">
            <Form.Label className="lf-label">
              Price ($){isFree && <span className="lf-note"> — Free</span>}
            </Form.Label>
            <Form.Control
              className="lf-input"
              type="number"
              min={0}
              placeholder="0"
              value={isFree ? "0" : form.price}
              disabled={isFree}
              onChange={(e) => set("price", e.target.value)}
              isInvalid={!!errors.price}
            />
            <Form.Control.Feedback type="invalid">
              {errors.price}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Location */}
      <Form.Group className="lf-group" controlId="lfLocation">
        <Form.Label className="lf-label">
          Location <span className="lf-required">*</span>
        </Form.Label>
        <Form.Control
          className="lf-input"
          placeholder="e.g. Boston, MA"
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          isInvalid={!!errors.location}
        />
        <Form.Control.Feedback type="invalid">
          {errors.location}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Status — edit only */}
      {showStatus && (
        <Form.Group className="lf-group" controlId="lfStatus">
          <Form.Label className="lf-label">Status</Form.Label>
          <Form.Select
            className="lf-input"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {/* Seller name + email */}
      <Row className="g-3">
        <Col md={6}>
          <Form.Group className="lf-group" controlId="lfSellerName">
            <Form.Label className="lf-label">
              Seller Name <span className="lf-required">*</span>
            </Form.Label>
            <Form.Control
              className="lf-input"
              placeholder="Your name"
              value={form.sellerName}
              onChange={(e) => set("sellerName", e.target.value)}
              isInvalid={!!errors.sellerName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.sellerName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="lf-group" controlId="lfSellerEmail">
            <Form.Label className="lf-label">
              Seller Email <span className="lf-required">*</span>
            </Form.Label>
            <Form.Control
              className="lf-input"
              type="email"
              placeholder="you@example.com"
              value={form.sellerEmail}
              onChange={(e) => set("sellerEmail", e.target.value)}
              isInvalid={!!errors.sellerEmail}
            />
            <Form.Control.Feedback type="invalid">
              {errors.sellerEmail}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Image */}
      <Form.Group className="lf-group" controlId="lfImage">
        <Form.Label className="lf-label">
          Plant Image <span className="lf-note">(optional, defaults to plant type image)</span>
        </Form.Label>

        {/* Upload box */}
        <label
          className="lf-upload-box"
          htmlFor="lfFileInput"
          tabIndex={0}
          role="button"
          aria-label="Upload a plant image"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("lfFileInput").click();
            }
          }}
        >
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Preview" className="lf-preview-img" />
          ) : (
            <div className="lf-upload-placeholder">
              <span className="lf-upload-icon">+</span>
              <span className="lf-upload-text">Click to upload an image</span>
              <span className="lf-upload-hint">JPG, PNG, max 3 MB</span>
            </div>
          )}
          <input
            id="lfFileInput"
            type="file"
            accept="image/*"
            className="lf-file-hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.size > 3 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, imageUrl: "Image must be under 3 MB." }));
                return;
              }
              const reader = new FileReader();
              reader.onload = () => set("imageUrl", reader.result);
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {errors.imageUrl && (
          <div className="lf-error">{errors.imageUrl}</div>
        )}

        {/* Remove button */}
        {form.imageUrl && (
          <button
            type="button"
            className="lf-remove-btn"
            onClick={() => set("imageUrl", "")}
          >
            Remove image
          </button>
        )}

        {/* URL input option */}
        <div className="lf-url-section">
          <button
            type="button"
            className="lf-url-toggle"
            onClick={() => setShowUrlInput((prev) => !prev)}
          >
            {showUrlInput ? "Hide URL input" : "No file? Paste a public image URL instead"}
          </button>

          {showUrlInput && (
            <>
              <Form.Text className="lf-hint mt-2">
                The URL must be publicly accessible, or the image will not display.
              </Form.Text>
              <Form.Control
                className="lf-input mt-1"
                placeholder="https://..."
                value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
              />
            </>
          )}
        </div>

      </Form.Group>

      {/* Tags */}
      <Form.Group className="lf-group" controlId="lfTags">
        <Form.Label className="lf-label">
          Tags <span className="lf-note">(optional)</span>
        </Form.Label>
        <div className="lf-tags-grid">
          {TAGS_POOL.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`lf-tag-btn ${form.tags.includes(tag) ? "selected" : ""}`}
              aria-pressed={form.tags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </Form.Group>

      {/* Submit */}
      <div className="lf-submit-row">
        <Button
          type="submit"
          className="btn-green lf-submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {submitLabel}…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </Form>
  );
}

ListingForm.propTypes = {
  initialValues: PropTypes.shape({
    plantName: PropTypes.string,
    plantType: PropTypes.string,
    description: PropTypes.string,
    condition: PropTypes.string,
    listingType: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    status: PropTypes.string,
    sellerName: PropTypes.string,
    sellerEmail: PropTypes.string,
    imageUrl: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  submitLabel: PropTypes.string,
  showStatus: PropTypes.bool,
};
