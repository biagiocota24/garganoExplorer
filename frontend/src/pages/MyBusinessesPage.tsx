import { useEffect, useState } from "react";
import { getMyBusinesses, type Business } from "../api/business";
import { Link } from "react-router";
import { Col, Row } from "react-bootstrap";
import PlaceCard from "../components/placeCard/PlaceCard";
import LoadingState from "../components/feedback/LoadingState";
import ErrorState from "../components/feedback/ErrorState";
import EmptyState from "../components/feedback/EmptyState";
import { getErrorMessage } from "../api/errors";
import {
  businessCategoryTranslations,
  priceRangeDescriptions,
  townTranslations,
} from "../constants/labels";
import { optimizedImage } from "../utils/cloudinary";

const MyBusinessesPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let ignore = false;
    const loadMyBusinesses = async () => {
      try {
        const result = await getMyBusinesses();
        if (ignore) return;
        setBusinesses(result);
        setStatus("success");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(
          getErrorMessage(err, "Impossibile caricare le attività."),
        );
        setStatus("error");
      }
    };

    loadMyBusinesses();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="mb-3">
          <h1 className="mb-0">Le mie attività</h1>
        </div>
        <Link to="/my-businesses/new" className="btn btn-outline-primary">
          + Aggiungi attività
        </Link>
      </div>

      {status === "error" && (
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      )}

      {status === "loading" && <LoadingState />}

      {status === "success" && businesses.length === 0 && (
        <EmptyState
          message="Non hai ancora registrato nessuna attività."
          action={
            <Link to="/my-businesses/new" className="btn btn-primary">
              Registra la tua prima attività
            </Link>
          }
        />
      )}

      {status === "success" && businesses.length > 0 && (
        <Row xs={1} sm={2} md={3} xl={4} className="g-4 mt-2">
          {businesses.map((b: Business) => (
            <Col key={b.id}>
              <PlaceCard
                to={`/businesses/${b.id}`}
                title={b.name}
                subtitle={townTranslations[b.town]}
                badge={businessCategoryTranslations[b.category]}
                description={b.description}
                tone={b.category}
                extra={b.priceRange && priceRangeDescriptions[b.priceRange]}
                imageUrl={
                  b.photos[0]
                    ? optimizedImage(b.photos[0].url, 600, 400)
                    : undefined
                }
                rating={{ average: b.averageRating, count: b.reviewCount }}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default MyBusinessesPage;
