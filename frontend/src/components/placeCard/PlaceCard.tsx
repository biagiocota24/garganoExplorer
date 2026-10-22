import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import "./placeCard.css"

type Props = {
  to: string;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  imageUrl?: string | null;
  /** Chiave per il colore della fascia quando manca la foto (es. la categoria) */
  tone?: string;
  /** Contenuto extra sopra "Scopri di più" (es. prezzo, valutazione) */
  extra?: ReactNode;
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
}: Props) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

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
        {extra && <div className="place-card__extra">{extra}</div>}
        <span className="place-card__more">
          Scopri di più <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
};

export default PlaceCard;
