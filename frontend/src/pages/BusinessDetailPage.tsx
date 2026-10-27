import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { ApiError } from "../api/client";
import {
  deleteBusiness,
  getBusinessById,
  type Business,
} from "../api/business";
import LoadingSpinner from "../components/Loadingspinner";
import PlaceDetail from "../components/placeDetail/PlaceDetail";
import ConfirmModal from "../components/ConfirmModal";
import {
  businessCategoryTranslations,
  priceRangeDescriptions,
  townTranslations,
} from "../constants/labels";
import { useAuthStore } from "../stores/authStore";

const BusinessDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "notFound"
  >("loading");
  const [business, setBusiness] = useState<Business | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
          setStatus("error");
        }
      }
    };
    loadBusiness();

    return () => {
      ignore = true;
    };
  }, [id]);

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
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        setDeleteError("Non hai i permessi per eliminare questa attività.");
      } else {
        setDeleteError("Eliminazione non riuscita. Riprova.");
      }
      setIsDeleting(false);
    }
  };

  return (
    <>
      {status === "loading" && (
        <LoadingSpinner text="Caricamento in corso..." variant="primary" />
      )}

      {status === "error" && (
        <Alert variant="danger" className="mt-5">
          Caricamento dell'attività non riuscito.{" "}
          <Link to="/businesses">Torna alle attività</Link>
        </Alert>
      )}

      {status === "notFound" && (
        <Alert variant="info" className="mt-5">
          Attività non trovata.{" "}
          <Link to="/businesses">Torna alle attività</Link>
        </Alert>
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
            aside={
              <>
                <h2 className="place-detail__section-title">Informazioni</h2>
                <dl className="info-list">
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
                  <a
                    className="btn btn-primary w-100 mt-4"
                    href={`https://www.google.com/maps?q=${business.latitude},${business.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apri in Google Maps
                  </a>
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
                  </div>
                )}
              </>
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
        </>
      )}
    </>
  );
};

export default BusinessDetailsPage;
