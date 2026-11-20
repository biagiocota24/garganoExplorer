import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import type { Review } from "../../api/review";
import StarRating from "../starRating/StarRating";
import { formatFullDate, formatRelativeTime } from "../../utils/dates";
import "./reviewItem.css";

type ReviewItemProps = {
  review: Review;
  isOwn?: boolean;
  canDelete?: boolean;
  isBusy?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

const LONG_TEXT = 320;
const EDIT_THRESHOLD_MS = 60_000;
const AVATAR_TONES = 6;

// Stesso nome → stesso colore dell'avatar, sempre
const toneFromName = (name: string) => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(hash) % AVATAR_TONES;
};

const ReviewItem = ({
  review,
  isOwn = false,
  canDelete = false,
  isBusy = false,
  onEdit,
  onDelete,
}: ReviewItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const initial = review.authorName.trim().charAt(0).toUpperCase() || "?";
  const isLong = review.text.length > LONG_TEXT;
  const wasEdited =
    new Date(review.updatedAt).getTime() - new Date(review.createdAt).getTime() > EDIT_THRESHOLD_MS;
  const canEdit = isOwn && !!onEdit;
  const showDelete = (isOwn || canDelete) && !!onDelete;

  return (
    <article className={`review-item ${isOwn ? "is-own" : ""}`}>
      <div className="review-item__avatar" data-tone={toneFromName(review.authorName)} aria-hidden="true">
        {initial}
      </div>

      <div className="review-item__body">
        <header className="review-item__header">
          <div className="review-item__author">
            <span className="review-item__name">{review.authorName}</span>
            {isOwn && (
              <Badge bg="primary" pill className="review-item__badge">
                La tua recensione
              </Badge>
            )}
          </div>

          <div className="review-item__meta">
            {"rating" in review && <StarRating value={review.rating} size={14} />}
            <time dateTime={review.createdAt} title={formatFullDate(review.createdAt)}>
              {formatRelativeTime(review.createdAt)}
            </time>
            {wasEdited && (
              <span className="review-item__edited" title={`Modificata ${formatFullDate(review.updatedAt)}`}>
                · modificata
              </span>
            )}
          </div>
        </header>

        <p className={`review-item__text ${isLong && !expanded ? "is-clamped" : ""}`}>{review.text}</p>

        {isLong && (
          <button
            type="button"
            className="review-item__toggle"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? "Mostra meno" : "Leggi tutto"}
          </button>
        )}

        {(canEdit || showDelete) && (
          <div className="review-item__actions">
            {canEdit && (
              <Button variant="outline-secondary" size="sm" onClick={onEdit} disabled={isBusy}>
                <IoCreateOutline className="me-1" aria-hidden="true" />
                Modifica
              </Button>
            )}
            {showDelete && (
              <Button variant="outline-danger" size="sm" onClick={onDelete} disabled={isBusy}>
                <IoTrashOutline className="me-1" aria-hidden="true" />
                {isOwn ? "Elimina" : "Elimina (moderazione)"}
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ReviewItem;