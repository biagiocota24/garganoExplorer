import { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router";
import LoadingState from "../components/feedback/LoadingState";
import ErrorState from "../components/feedback/ErrorState";
import EmptyState from "../components/feedback/EmptyState";
import PlaceCard from "../components/placeCard/PlaceCard";
import {
  attractionCategoryTranslations,
  businessCategoryTranslations,
  townTranslations,
} from "../constants/labels";
import { getErrorMessage } from "../api/errors";
import { getMyFavorites, type FavoritesResponse } from "../api/favorite";
import { optimizedImage } from "../utils/cloudinary";
import { useFavoriteStore } from "../stores/favoriteStore";

const FavoritePage = () => {
  const [data, setData] = useState<FavoritesResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Id dei preferiti dallo store: quando togli un cuore, la card sparisce subito
  const businessIds = useFavoriteStore((s) => s.businessIds);
  const attractionIds = useFavoriteStore((s) => s.attractionIds);

  const businesses = useMemo(
    () => data?.businesses.filter((b) => businessIds.has(b.id)) ?? [],
    [data, businessIds],
  );

  const attractions = useMemo(
    () => data?.attractions.filter((a) => attractionIds.has(a.id)) ?? [],
    [data, attractionIds],
  );

  const isEmpty = businesses.length === 0 && attractions.length === 0;

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let ignore = false;

    const loadFavorites = async () => {
      try {
        const result = await getMyFavorites();
        if (ignore) return;
        setData(result);
        setStatus("success");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(
          getErrorMessage(err, "Impossibile caricare i preferiti."),
        );
        setStatus("error");
      }
    };

    loadFavorites();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  return (
    <>
      <div className="mb-3">
        <h1 className="mb-0">I miei preferiti</h1>
      </div>

      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      )}

      {status === "success" && isEmpty && (
        <EmptyState
          message="Non hai ancora salvato nessun luogo. Tocca il cuore per aggiungerlo ai preferiti."
          action={
            <Link to="/attractions" className="btn btn-outline-primary">
              Esplora le attrazioni
            </Link>
          }
        />
      )}

      {status === "success" && attractions.length > 0 && (
        <section className="mb-4">
          <h2 className="h4 mt-2">Attrazioni ({attractions.length})</h2>
          <Row xs={1} sm={2} md={3} xl={4} className="g-4 mt-1">
            {attractions.map((a) => (
              <Col key={a.id}>
                <PlaceCard
                  to={`/attractions/${a.id}`}
                  title={a.name}
                  subtitle={townTranslations[a.town]}
                  badge={attractionCategoryTranslations[a.category]}
                  description={a.description}
                  tone={a.category}
                  reviewCount={a.reviewCount}
                  imageUrl={
                    a.photos[0]
                      ? optimizedImage(a.photos[0].url, 600, 400)
                      : undefined
                  }
                  id={a.id}
                  placeType="attraction"
                />
              </Col>
            ))}
          </Row>
        </section>
      )}

      {status === "success" && businesses.length > 0 && (
        <section className="mb-4">
          <h2 className="h4 mt-2">Attività ({businesses.length})</h2>
          <Row xs={1} sm={2} md={3} xl={4} className="g-4 mt-1">
            {businesses.map((b) => (
              <Col key={b.id}>
                <PlaceCard
                  to={`/businesses/${b.id}`}
                  title={b.name}
                  subtitle={townTranslations[b.town]}
                  badge={businessCategoryTranslations[b.category]}
                  description={b.description}
                  tone={b.category}
                  rating={{ average: b.averageRating, count: b.reviewCount }}
                  imageUrl={
                    b.photos[0]
                      ? optimizedImage(b.photos[0].url, 600, 400)
                      : undefined
                  }
                  id={b.id}
                  placeType="business"
                />
              </Col>
            ))}
          </Row>
        </section>
      )}
    </>
  );
};

export default FavoritePage;
