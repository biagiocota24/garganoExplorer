import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { formatRating, formatReviewCount } from "../../utils/rating";
import "./starRating.css";

type StarRatingProps = {
  value: number;
  size?: number;
  reviewCount?: number;
  showValue?: boolean;
  className?: string;
};

const STARS = [1, 2, 3, 4, 5];

const StarRating = ({
  value,
  size = 16,
  reviewCount,
  showValue = false,
  className = "",
}: StarRatingProps) => {
  // Limita il voto tra 0 e 5 e lo arrotonda al mezzo punto (4.3 → 4.5, 4.2 → 4)
  const safeValue = Math.min(Math.max(value, 0), 5);
  const rounded = Math.round(safeValue * 2) / 2;
  const formatted = formatRating(safeValue);

  // Testo accanto alle stelle: "4,3 · 12 recensioni"
  const details = [
    showValue ? formatted : null,
    reviewCount !== undefined && reviewCount > 0
      ? formatReviewCount(reviewCount)
      : null,
  ].filter(Boolean);

  const label =
    reviewCount !== undefined && reviewCount > 0
      ? `Valutazione ${formatted} su 5, ${formatReviewCount(reviewCount)}`
      : `Valutazione ${formatted} su 5`;

  return (
    <span className={`star-rating ${className}`} role="img" aria-label={label}>
      {STARS.map((position) => {
        const Icon =
          rounded >= position
            ? IoStar
            : rounded >= position - 0.5
              ? IoStarHalf
              : IoStarOutline;
        return (
          <Icon
            key={position}
            size={size}
            className="star-rating__star"
            aria-hidden="true"
          />
        );
      })}

      {details.length > 0 && (
        <span className="star-rating__value" aria-hidden="true">
          {details.join(" · ")}
        </span>
      )}
    </span>
  );
};

export default StarRating;
