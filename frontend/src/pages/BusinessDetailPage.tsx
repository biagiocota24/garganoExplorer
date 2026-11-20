import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { ApiError } from "../api/client";
import {
  deleteBusiness,
  getBusinessById,
  type Business,
} from "../api/business";
import LoadingState from "../components/feedback/LoadingState";
import ErrorState from "../components/feedback/ErrorState";
import { getErrorMessage } from "../api/errors";
import PlaceDetail from "../components/placeDetail/PlaceDetail";
import ConfirmModal from "../components/ConfirmModal";
import {
  businessCategoryTranslations,
  priceRangeDescriptions,
  townTranslations,
} from "../constants/labels";
import { useAuthStore } from "../stores/authStore";
import ChangeRequestModal from "../components/ChangeRequestModal";
import StarRating from "../components/starRating/StarRating";
import ReviewSection from "../components/reviewSection/ReviewSection";

const BusinessDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "notFound"
  >("loading");
  const [business, setBusiness] = useState<Business | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [changeRequestSent, setChangeRequestSent] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadBusiness = async () => {
      if (!id) {
        setStatus("notFound");
        return;
      }
      try {
        const result = await getBusinessById(id);
        if (ignore) return;
        setBusiness(result);
        setStatus("success");
      } catch (error) {
        if (ignore) return;
        if (error instanceof ApiError && error.status === 404) {
          setStatus("notFound");
        } else {
          setErrorMessage(
            getErrorMessage(error, "Impossibile caricare l'attività."),
          );
          setStatus("error");
        }
      }
    };
    loadBusiness();

    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  // Proprietario dell'attività oppure admin
  const isOwner = !!user && !!business && user.id === business.ownerId;
  const isAdmin = user?.role === "ADMIN";

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  const handleDelete = async () => {
    if (!business) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteBusiness(business.id);
      const isOwner = user?.id === business.ownerId;
      navigate(isOwner ? "/my-businesses" : "/businesses", { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setDeleteError("Non hai i permessi per eliminare questa attività.");
      } else {
        setDeleteError(
          getErrorMessage(error, "Eliminazione non riuscita. Riprova."),
        );
      }
      setIsDeleting(false);
    }
  };

  const refreshBusiness = async () => {
    if (!id) return;
    try {
      const updated = await getBusinessById(id);
      setBusiness(updated);
    } catch {
      // IN CASO DI ERRORE IL CONTEGGIO SI AGGIORNERA' AL PROSSIMO CARICAMENTO DI PAGINA. NON VALE LA PENA FARE NULLA
    }
  };
  return (
    <>
      {status === "loading" && <LoadingState />}

      {status === "error" && (
        <ErrorState
          message={errorMessage}
          onRetry={handleRetry}
          backTo="/businesses"
          backLabel="Torna alle attività"
        />
      )}

      {status === "notFound" && (
        <ErrorState
          message="Attività non trovata."
          backTo="/businesses"
          backLabel="Torna alle attività"
        />
      )}

      {status === "success" && business && (
        <>
          <PlaceDetail
            title={business.name}
            subtitle={townTranslations[business.town]}
            badge={businessCategoryTranslations[business.category]}
            description={business.description}
            tone={business.category}
            backTo="/businesses"
            backLabel="Torna alle attività"
            images={business.photos.map((photo) => photo.url)}
            aside={
              <>
                <h2 className="place-detail__section-title">Informazioni</h2>
                <dl className="info-list">
                  {business.reviewCount > 0 && (
                    <div>
                      <dt>Valutazione</dt>
                      <dd>
                        <a href="#reviews">
                          {business.averageRating !== null && (
                            <StarRating
                              reviewCount={business.reviewCount}
                              value={business.averageRating}
                              showValue
                            />
                          )}
                        </a>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt>Indirizzo</dt>
                    <dd>{business.address}</dd>
                  </div>
                  <div>
                    <dt>Comune</dt>
                    <dd>{townTranslations[business.town]}</dd>
                  </div>
                  <div>
                    <dt>Categoria</dt>
                    <dd>{businessCategoryTranslations[business.category]}</dd>
                  </div>
                  {business.priceRange && (
                    <div>
                      <dt>Fascia di prezzo</dt>
                      <dd>{priceRangeDescriptions[business.priceRange]}</dd>
                    </div>
                  )}
                </dl>

                {(business.phone || business.email || business.website) && (
                  <>
                    <h2 className="place-detail__section-title mt-4">
                      Contatti
                    </h2>
                    <dl className="info-list">
                      {business.phone && (
                        <div>
                          <dt>Telefono</dt>
                          <dd>
                            <a
                              href={`tel:${business.phone.replace(/\s/g, "")}`}
                            >
                              {business.phone}
                            </a>
                          </dd>
                        </div>
                      )}
                      {business.email && (
                        <div>
                          <dt>Email</dt>
                          <dd>
                            <a href={`mailto:${business.email}`}>
                              {business.email}
                            </a>
                          </dd>
                        </div>
                      )}
                      {business.website && (
                        <div>
                          <dt>Sito web</dt>
                          <dd>
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-break"
                            >
                              {business.website.replace(/^https?:\/\//i, "")}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </>
                )}

                {business.latitude !== null && business.longitude !== null && (
                  <Link
                    className="btn btn-primary w-100 mt-4"
                    to={`/map?focus=${business.id}`}
                    rel="noopener noreferrer"
                  >
                    Vedi sulla mappa
                  </Link>
                )}

                {(canEdit || canDelete) && (
                  <div className="d-flex flex-column gap-2 mt-4 pt-4 border-top">
                    {canEdit && (
                      <Link
                        to={`/my-businesses/${business.id}/edit`}
                        className="btn btn-outline-primary"
                      >
                        Modifica
                      </Link>
                    )}
                    {canDelete && (
                      <Button
                        variant="outline-danger"
                        onClick={() => {
                          setDeleteError(null);
                          setShowDelete(true);
                        }}
                      >
                        Elimina
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setChangeRequestSent(false);
                          setShowChangeRequest(true);
                        }}
                      >
                        Segnala una modifica
                      </Button>
                    )}
                    {changeRequestSent && (
                      <Alert
                        variant="success"
                        dismissible
                        onClose={() => setChangeRequestSent(false)}
                        className="mb-0"
                      >
                        Segnalazione inviata al proprietario.
                      </Alert>
                    )}
                  </div>
                )}
              </>
            }
            children={
              <ReviewSection
                placeType="business"
                placeId={business.id}
                onStatsChange={refreshBusiness}
              />
            }
          />
          <ConfirmModal
            show={showDelete}
            title="Eliminare questa attività?"
            confirmLabel="Elimina"
            isProcessing={isDeleting}
            error={deleteError}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
          >
            Stai per eliminare <strong>{business.name}</strong>. L'operazione
            non si può annullare.
          </ConfirmModal>
          <ChangeRequestModal
            show={showChangeRequest}
            businessId={business.id}
            businessName={business.name}
            onClose={() => setShowChangeRequest(false)}
            onSent={() => setChangeRequestSent(true)}
          />
        </>
      )}
    </>
  );
};

export default BusinessDetailsPage;
