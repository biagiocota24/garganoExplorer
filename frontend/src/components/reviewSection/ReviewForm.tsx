import { useState } from "react";
import type { FormEvent } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { ApiError } from "../../api/client";
import { getErrorMessage } from "../../api/errors";
import type { PlaceType, ReviewInput } from "../../api/review";
import StarRatingInput from "../starRating/StarRatingInput";

type ReviewFormProps = {
  placeType: PlaceType;
  initialValue?: ReviewInput;
  submitLabel: string;
  onSubmit: (input: ReviewInput) => Promise<void>;
  onCancel?: () => void;
};

const MIN_TEXT = 10;
const MAX_TEXT = 2000;

const ReviewForm = ({
  placeType,
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
}: ReviewFormProps) => {
  const needsRating = placeType === "business";

  const [rating, setRating] = useState(initialValue?.rating ?? 0);
  const [text, setText] = useState(initialValue?.text ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedLength = text.trim().length;
  const ratingMissing = needsRating && rating === 0;
  const textTooShort = trimmedLength < MIN_TEXT;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    if (ratingMissing || textTooShort) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, text: text.trim() });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Hai già recensito questo luogo.");
      } else if (err instanceof ApiError && err.status === 403) {
        setError("Non puoi recensire questo luogo.");
      } else if (err instanceof ApiError && err.status === 400) {
        setError(getErrorMessage(err, "Controlla i dati inseriti e riprova."));
      } else {
        setError(getErrorMessage(err, "Invio non riuscito. Riprova tra poco."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit} className="review-form">
      {error && <Alert variant="danger">{error}</Alert>}

      {needsRating && (
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Il tuo voto</Form.Label>
          <StarRatingInput
            value={rating}
            onChange={setRating}
            disabled={isSubmitting}
            isInvalid={submitted && ratingMissing}
          />
          {submitted && ratingMissing && (
            <div className="text-danger small mt-1">
              Scegli un voto da 1 a 5 stelle.
            </div>
          )}
        </Form.Group>
      )}

      <Form.Group controlId={`review-text-${placeType}`} className="mb-3">
        <Form.Label className="fw-semibold">La tua recensione</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_TEXT}
          placeholder="Racconta la tua esperienza: cosa ti è piaciuto, cosa miglioreresti…"
          isInvalid={submitted && textTooShort}
          disabled={isSubmitting}
        />
        <Form.Control.Feedback type="invalid">
          Scrivi almeno {MIN_TEXT} caratteri.
        </Form.Control.Feedback>
        <Form.Text
          className={
            textTooShort && trimmedLength > 0 ? "text-danger" : undefined
          }
        >
          {trimmedLength} / {MAX_TEXT}
        </Form.Text>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        {onCancel && (
          <Button
            variant="outline-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annulla
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner size="sm" className="me-2" />}
          {submitLabel}
        </Button>
      </div>
    </Form>
  );
};

export default ReviewForm;
