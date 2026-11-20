import { Link, NavLink, useNavigate, useParams } from "react-router";
import {
  deleteAttraction,
  getAttractionById,
  type Attraction,
} from "../api/attraction";
import { useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { Button } from "react-bootstrap";
import LoadingState from "../components/feedback/LoadingState";
import ErrorState from "../components/feedback/ErrorState";
import { getErrorMessage } from "../api/errors";
import PlaceDetail from "../components/placeDetail/PlaceDetail";
import {
  attractionCategoryTranslations,
  townTranslations,
} from "../constants/labels";
import { useAuthStore } from "../stores/authStore";
import ConfirmModal from "../components/ConfirmModal";
import ReviewSection from "../components/reviewSection/ReviewSection";

const AttractionDetailsPage = () => {
  const { id } = useParams();
  const role = useAuthStore((state) => state.user?.role);
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "notFound"
  >("loading");
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let ignore = false;

    const loadAttraction = async () => {
      if (!params.id) {
        setStatus("notFound");
        return;
      }
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
          setErrorMessage(
            getErrorMessage(error, "Impossibile caricare l'attrazione."),
          );
          setStatus("error");
        }
      }
    };
    loadAttraction();

    return () => {
      ignore = true;
    };
  }, [params.id, reloadKey]);

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!attraction) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAttraction(attraction.id);
      navigate("/attractions", { replace: true });
    } catch (error) {
      setDeleteError(
        getErrorMessage(error, "Eliminazione non riuscita. Riprova."),
      );
      setIsDeleting(false);
    }
  };

  const refreshAttraction = async () => {
    if (!id) return;
    try {
      const updated = await getAttractionById(id);
      setAttraction(updated);
    } catch {
      // IN CASO DI ERRORE IL CONTEGGIO SI AGGIORNERA' AL PROSSIMO CARICAMENTO DI PAGINA. NON VALE LA PENA FARE NULLA
    }
  };

  return (
    <>
      {status === "error" && (
        <ErrorState
          message={errorMessage}
          onRetry={handleRetry}
          backTo="/attractions"
          backLabel="Torna alle attrazioni"
        />
      )}

      {status === "notFound" && (
        <ErrorState
          message="Attrazione non trovata."
          backTo="/attractions"
          backLabel="Torna alle attrazioni"
        />
      )}

      {status === "loading" && <LoadingState />}

      {status === "success" && attraction && (
        <>
          <PlaceDetail
            title={attraction.name}
            subtitle={townTranslations[attraction.town]}
            badge={attractionCategoryTranslations[attraction.category]}
            description={attraction.description}
            tone={attraction.category}
            backTo="/attractions"
            backLabel="Torna alle attrazioni"
            images={attraction.photos.map((photo) => photo.url)}
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
                    <dd>
                      {attractionCategoryTranslations[attraction.category]}
                    </dd>
                  </div>
                </dl>
                {attraction.latitude !== null &&
                  attraction.longitude !== null && (
                    <Link
                      className="btn btn-primary w-100 mt-4"
                      to={`/map?focus=${attraction.id}`}
                      rel="noopener noreferrer"
                    >
                      Vedi sulla mappa
                    </Link>
                  )}
                {role === "ADMIN" && (
                  <>
                    <NavLink
                      to={`/admin/attractions/${params.id}/edit`}
                      className="btn btn-warning w-100 mt-2"
                    >
                      Gestisci attrazione
                    </NavLink>
                    <Button
                      variant="danger"
                      className="w-100 mt-2"
                      onClick={() => {
                        setDeleteError(null);
                        setShowDelete(true);
                      }}
                    >
                      Elimina attrazione
                    </Button>
                  </>
                )}
              </>
            }
            children={
              <ReviewSection
                placeType="attraction"
                placeId={attraction.id}
                onStatsChange={refreshAttraction}
              />
            }
          />
          <ConfirmModal
            show={showDelete}
            title="Eliminare questa attrazione?"
            confirmLabel="Elimina"
            isProcessing={isDeleting}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
          >
            Stai per eliminare <strong>{attraction.name}</strong>. L'operazione
            non si può annullare.
          </ConfirmModal>
        </>
      )}
    </>
  );
};

export default AttractionDetailsPage;
