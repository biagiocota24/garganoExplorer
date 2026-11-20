import { useState } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";
import "./starRating.css";

type StarRatingInputProps = {
  value: number; // 0 = nessun voto scelto
  onChange: (value: number) => void;
  disabled?: boolean;
  isInvalid?: boolean;
  size?: number;
};

const STARS = [1, 2, 3, 4, 5];
const LABELS = ["Pessimo", "Scarso", "Nella media", "Buono", "Eccellente"];

const StarRatingInput = ({
  value,
  onChange,
  disabled = false,
  isInvalid = false,
  size = 28,
}: StarRatingInputProps) => {
  // Stella sotto il mouse (o con il focus): serve per l'anteprima prima del clic
  const [hovered, setHovered] = useState<number | null>(null);
  const displayed = hovered ?? value;

  return (
    <div className={`star-input ${isInvalid ? "is-invalid" : ""}`}>
      <div
        className="star-input__stars"
        role="radiogroup"
        aria-label="Valutazione"
        onMouseLeave={() => setHovered(null)}
      >
        {STARS.map((position) => {
          const isActive = displayed >= position;
          return (
            <button
              key={position}
              type="button"
              role="radio"
              aria-checked={value === position}
              aria-label={`${position} ${position === 1 ? "stella" : "stelle"} – ${LABELS[position - 1]}`}
              className={`star-input__button ${isActive ? "is-active" : ""}`}
              disabled={disabled}
              onMouseEnter={() => setHovered(position)}
              onFocus={() => setHovered(position)}
              onBlur={() => setHovered(null)}
              onClick={() => onChange(position)}
            >
              {isActive ? (
                <IoStar size={size} aria-hidden="true" />
              ) : (
                <IoStarOutline size={size} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <span className="star-input__label" aria-live="polite">
        {displayed > 0 ? LABELS[displayed - 1] : "Seleziona un voto"}
      </span>
    </div>
  );
};

export default StarRatingInput;
