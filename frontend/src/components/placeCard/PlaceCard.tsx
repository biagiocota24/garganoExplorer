import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { IoStar } from "react-icons/io5";
import "./placeCard.css";
import { formatRating, formatReviewCount } from "../../utils/rating";

type Props = {
  to: string;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  imageUrl?: string | null;
  /** Chiave per il colore della fascia quando manca la foto (es. la categoria) */
  tone?: string;
  /** Contenuto extra sopra "Scopri di più" (es. fascia di prezzo) */
  extra?: ReactNode;
  /** Luoghi con voto (attività): media e numero di recensioni */
  rating?: { average: number | null; count: number };
  /** Luoghi senza voto (attrazioni): solo il numero di recensioni */
  reviewCount?: number;
};

const PlaceCard = ({
  to,
  title,
  subtitle,
  badge,
  description,
  imageUrl,
  tone,
  extra,
  rating,
  reviewCount,
}: Props) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  // "★ 4,3 (12)" per le attività, "Nuovo" se non hanno recensioni,
  // "N recensioni" per le attrazioni (che non hanno voto)
  let ratingInfo: ReactNode = null;
  if (rating) {
    ratingInfo =
      rating.count > 0 && rating.average !== null ? (
        <span className="place-card__rating">
          <IoStar className="place-card__star" aria-hidden="true" />
          <span aria-hidden="true">
            {formatRating(rating.average)} ({rating.count})
          </span>
          <span className="visually-hidden">
            Valutazione {formatRating(rating.average)} su 5,{" "}
            {formatReviewCount(rating.count)}
          </span>
        </span>
      ) : (
        <span className="place-card__new">Nuovo</span>
      );
  } else if (reviewCount !== undefined && reviewCount > 0) {
    ratingInfo = (
      <span className="place-card__reviews">
        {formatReviewCount(reviewCount)}
      </span>
    );
  }

  return (
    <Link to={to} className="place-card" data-tone={tone}>
      <div className="place-card__cover">
        {showImage && (
          <img
            src={imageUrl!}
            alt=""
            loading="lazy"
            className="place-card__image"
            onError={() => setImageFailed(true)}
          />
        )}
        {badge && <span className="place-card__badge">{badge}</span>}
      </div>

      <div className="place-card__body">
        {subtitle && <span className="place-card__subtitle">{subtitle}</span>}
        <h3 className="place-card__title">{title}</h3>
        {description && <p className="place-card__text">{description}</p>}
        {(extra || ratingInfo) && (
          <div className="place-card__extra">
            {ratingInfo}
            {extra && <span>{extra}</span>}
          </div>
        )}
        <span className="place-card__more">
          Scopri di più <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
};

export default PlaceCard;
