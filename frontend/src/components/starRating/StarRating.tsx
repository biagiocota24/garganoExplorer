import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import "./starRating.css";

type StarRatingProps = {
  value: number;
  size?: number;
  reviewCount?: number;
  showValue?: boolean;
  className?: string;
};

const STARS = [1, 2, 3, 4, 5];

const ratingFormatter = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

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
  const formatted = ratingFormatter.format(safeValue);

  return (
    <span
      className={`star-rating ${className}`}
      role="img"
      aria-label={`Valutazione ${formatted} su 5`}
    >
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

      {showValue && (
        <span className="star-rating__value" aria-hidden="true">
          {formatted}
        </span>
      )}
      {reviewCount && <span className="star-rating__value">{`( ${reviewCount} )`}</span>}
    </span>
  );
};

export default StarRating;
