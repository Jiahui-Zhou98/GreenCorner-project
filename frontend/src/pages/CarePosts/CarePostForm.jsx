import { useState } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import "./CarePostForm.css";

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

const DIFFICULTIES = ["easy", "medium", "hard"];
const LIGHT_OPTIONS = ["low", "medium", "bright indirect", "direct sunlight"];

const EMPTY_FORM = {
  title: "",
  plantType: "",
  difficulty: "easy",
  light: "",
  watering: "",
  content: "",
  author: "",
  imageUrl: "",
};

export default function CarePostForm({
  initialValues = {},
  onSubmit,
  submitting = false,
  submitLabel = "Submit",
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  }

  function validate() {
    const e = {};

    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.plantType) e.plantType = "Please select a plant type.";
    if (!form.difficulty) e.difficulty = "Please select a difficulty.";
    if (!form.content.trim()) e.content = "Content is required.";
    if (!form.author.trim()) e.author = "Author name is required.";

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
      title: form.title.trim(),
      plantType: form.plantType,
      difficulty: form.difficulty,
      light: form.light,
      watering: form.watering.trim(),
      content: form.content.trim(),
      author: form.author.trim(),
      imageUrl: form.imageUrl.trim() || null,
    };

    onSubmit(payload);
  }

  return (
    <Form noValidate onSubmit={handleSubmit} className="carepost-form">
      {/* Title */}
      <Form.Group className="cpf-group">
        <Form.Label className="cpf-label">
          Title <span className="cpf-required">*</span>
        </Form.Label>
        <Form.Control
          className="cpf-input"
          placeholder="e.g. Monstera Care Guide"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          isInvalid={!!errors.title}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Plant Type + Difficulty */}
      <Row className="g-3">
        <Col md={6}>
          <Form.Group className="cpf-group">
            <Form.Label className="cpf-label">
              Plant Type <span className="cpf-required">*</span>
            </Form.Label>
            <Form.Select
              className="cpf-input"
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
          <Form.Group className="cpf-group">
            <Form.Label className="cpf-label">
              Difficulty <span className="cpf-required">*</span>
            </Form.Label>
            <Form.Select
              className="cpf-input"
              value={form.difficulty}
              onChange={(e) => set("difficulty", e.target.value)}
              isInvalid={!!errors.difficulty}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.difficulty}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Light + Watering */}
      <Row className="g-3">
        <Col md={6}>
          <Form.Group className="cpf-group">
            <Form.Label className="cpf-label">Light</Form.Label>
            <Form.Select
              className="cpf-input"
              value={form.light}
              onChange={(e) => set("light", e.target.value)}
            >
              <option value="">Select light…</option>
              {LIGHT_OPTIONS.map((light) => (
                <option key={light} value={light}>
                  {light.charAt(0).toUpperCase() + light.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="cpf-group">
            <Form.Label className="cpf-label">Watering</Form.Label>
            <Form.Control
              className="cpf-input"
              placeholder="e.g. Once a week"
              value={form.watering}
              onChange={(e) => set("watering", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Content */}
      <Form.Group className="cpf-group">
        <Form.Label className="cpf-label">
          Care Guide <span className="cpf-required">*</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={7}
          className="cpf-input cpf-textarea"
          placeholder="Write your plant care tips, watering routine, light advice, and anything helpful for other plant lovers..."
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          isInvalid={!!errors.content}
        />
        <Form.Control.Feedback type="invalid">
          {errors.content}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Author */}
      <Form.Group className="cpf-group">
        <Form.Label className="cpf-label">
          Author <span className="cpf-required">*</span>
        </Form.Label>
        <Form.Control
          className="cpf-input"
          placeholder="Your name"
          value={form.author}
          onChange={(e) => set("author", e.target.value)}
          isInvalid={!!errors.author}
        />
        <Form.Control.Feedback type="invalid">
          {errors.author}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Image URL */}
      <Form.Group className="cpf-group">
        <Form.Label className="cpf-label">
          Image URL <span className="cpf-note">(optional)</span>
        </Form.Label>
        <Form.Control
          className="cpf-input"
          placeholder="https://..."
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
        />
        <Form.Text className="cpf-hint">
          Leave blank to use a default plant placeholder.
        </Form.Text>
      </Form.Group>

      {/* Submit */}
      <div className="cpf-submit-row">
        <Button
          type="submit"
          className="btn-green cpf-submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {submitLabel}...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </Form>
  );
}
