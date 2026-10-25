import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Carousel, Col, Row } from "react-bootstrap";
import "./placeDetail.css"

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  description: string;
  images?: string[];
  tone?: string;
  backTo: string;
  backLabel: string;
  /** Contenuto della colonna laterale (informazioni, contatti, ...) */
  aside?: ReactNode;
};

const PlaceDetail = ({
  title,
  subtitle,
  badge,
  description,
  images = [],
  tone,
  backTo,
  backLabel,
  aside,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);

  const photos = images.filter((src) => !failed.includes(src));
  const hasPhotos = photos.length > 0;
  const hasMany = photos.length > 1;
  const current = Math.min(activeIndex, Math.max(photos.length - 1, 0));

  const markFailed = (src: string) => {
    setFailed((prev) => (prev.includes(src) ? prev : [...prev, src]));
  };

  return (
    <article className="place-detail">
      <Link to={backTo} className="place-detail__back">
        <span aria-hidden="true">←</span> {backLabel}
      </Link>

      <div className={`place-detail__media ${hasMany ? "has-thumbs" : ""}`}>
        <header className="place-detail__hero" data-tone={tone}>
          {hasPhotos && (
            <Carousel
              activeIndex={current}
              onSelect={(index) => setActiveIndex(index)}
              interval={null}
              indicators={false}
              controls={hasMany}
              className="place-detail__carousel"
            >
              {photos.map((src, i) => (
                <Carousel.Item key={src}>
                  <img
                    src={src}
                    alt={`${title}: foto ${i + 1} di ${photos.length}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="place-detail__photo"
                    onError={() => markFailed(src)}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}

          {hasMany && (
            <span className="place-detail__counter" aria-live="polite">
              {current + 1} / {photos.length}
            </span>
          )}

          <div className="place-detail__hero-content">
            {badge && <span className="place-detail__badge">{badge}</span>}
            <h1 className="place-detail__title">{title}</h1>
            {subtitle && <p className="place-detail__subtitle">{subtitle}</p>}
          </div>
        </header>

        {hasMany && (
          <div
            className="place-detail__thumbs"
            role="list"
            aria-label="Miniature delle foto"
          >
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                role="listitem"
                className={`place-detail__thumb ${i === current ? "is-active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Mostra foto ${i + 1}`}
                aria-current={i === current}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Row className="g-4 mt-1">
        <Col lg={aside ? 8 : 12}>
          <section className="place-detail__panel">
            <h2 className="place-detail__section-title">Descrizione</h2>
            <p className="place-detail__description">{description}</p>
          </section>
        </Col>

        {aside && (
          <Col lg={4}>
            <aside className="place-detail__panel place-detail__aside">
              {aside}
            </aside>
          </Col>
        )}
      </Row>
    </article>
  );
};

export default PlaceDetail;
