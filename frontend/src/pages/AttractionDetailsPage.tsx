import { NavLink, useNavigate, useParams } from "react-router";
import {
  deleteAttraction,
  getAttractionById,
  type Attraction,
} from "../api/attraction";
import { useEffect, useState } from "react";
import { ApiError } from "../api/client";
import { Alert, Button } from "react-bootstrap";
import LoadingSpinner from "../components/Loadingspinner";
import PlaceDetail from "../components/placeDetail/PlaceDetail";
import {
  attractionCategoryTranslations,
  townTranslations,
} from "../constants/labels";
import { useAuthStore } from "../stores/authStore";
import ConfirmModal from "../components/ConfirmModal";

const AttractionDetailsPage = () => {
  const role = useAuthStore((state) => state.user?.role);
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "notFound"
  >("loading");
  const [attraction, setAttraction] = useState<Attraction | null>(null);

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
          setStatus("error");
        }
      }
    };
    loadAttraction();

    return () => {
      ignore = true;
    };
  }, [params.id]);

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
    } catch {
      setDeleteError("Eliminazione non riuscita. Riprova.");
      setIsDeleting(false);
    }
  };
  return (
    <>
      {status === "error" && (
        <Alert
          variant="danger"
          className="d-flex justify-content-center align-items-center mt-5"
          style={{ height: "200px" }}
        >
          Caricamento attrazione non riuscito!
        </Alert>
      )}
      {status === "notFound" && (
        <>
          <Alert
            variant="info"
            className="d-flex justify-content-center align-items-center mt-5"
            style={{ height: "200px" }}
          >
            Attrazione non trovata
          </Alert>
          <NavLink to="/attractions">&lt;--Torna alle attrazioni</NavLink>
        </>
      )}
      {status === "loading" && (
        <LoadingSpinner text="Caricamento in corso..." variant="primary" />
      )}

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
                    <a
                      className="btn btn-primary w-100 mt-4"
                      href={`https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apri in Google Maps
                    </a>
                  )}
                {role === "ADMIN" && (
                  <>
                    <NavLink
                      to={`/admin/attractions/${params.id}/edit`}
                      className="btn btn-warning w-100 mt-2"
                    >
                      Gestisci Attrazione
                    </NavLink>
                    <Button
                      variant="danger"
                      className="w-100 mt-2"
                      onClick={() => {
                        setDeleteError(null);
                        setShowDelete(true);
                      }}
                    >
                      Elimina Attrazione
                    </Button>
                  </>
                )}
              </>
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
