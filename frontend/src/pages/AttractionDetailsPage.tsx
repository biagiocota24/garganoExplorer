import { useParams } from "react-router";
import { getAttractionById, type Attraction } from "../api/attraction";
import { useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { Alert } from "react-bootstrap";
import LoadingSpinner from "../components/Loadingspinner";
import PlaceDetail from "../components/placeDetail/PlaceDetail";
import {
  attractionCategoryTranslations,
  townTranslations,
} from "../constants/labels";

const AttractionDetailsPage = () => {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "notFound"
  >("loading");
  const [attraction, setAttraction] = useState<Attraction | null>(null);

  const params = useParams();

  useEffect(() => {
    let ignore = false;

    const loadAttraction = async () => {
      if (!params.id) return;
      try {
        const result = await getAttractionById(params.id);
        if (ignore) return;
        setAttraction(result);
        setStatus("success");
      } catch (error) {
        if (ignore) return;
        if (error instanceof ApiError && error.status === 404) {
          setStatus("notFound");
        } else {
          setStatus("error");
        }
      }
    };
    loadAttraction();

    return () => {
      ignore = true;
    };
  }, [params.id]);
  return (
    <>
      {status === "error" && (
        <Alert
          variant="danger"
          className="d-flex justify-content-center align-items-center mt-5"
          style={{ height: "200px" }}
        >
          Caricamento attrazione non riuscita!
        </Alert>
      )}
      {status === "notFound" && (
        <Alert
          variant="danger"
          className="d-flex justify-content-center align-items-center mt-5"
          style={{ height: "200px" }}
        >
          Attrazione non trovata
        </Alert>
      )}
      {status === "loading" && (
        <LoadingSpinner text="Caricamento in corso..." variant="primary" />
      )}

      {status === "success" && attraction && (
        <PlaceDetail
          title={attraction.name}
          subtitle={townTranslations[attraction.town]}
          badge={attractionCategoryTranslations[attraction.category]}
          description={attraction.description}
          tone={attraction.category}
          backTo="/attractions"
          backLabel="Torna alle attrazioni"
          aside={
            <>
              <h2 className="place-detail__section-title">Informazioni</h2>
              <dl className="info-list">
                <div>
                  <dt>Comune</dt>
                  <dd>{townTranslations[attraction.town]}</dd>
                </div>
                <div>
                  <dt>Categoria</dt>
                  <dd>{attractionCategoryTranslations[attraction.category]}</dd>
                </div>
              </dl>
              {attraction.latitude !== null &&
                attraction.longitude !== null && (
                  <a
                    className="btn btn-primary w-100 mt-4"
                    href={`https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apri in Google Maps
                  </a>
                )}
            </>
          }
        />
      )}
    </>
  );
};

export default AttractionDetailsPage;
