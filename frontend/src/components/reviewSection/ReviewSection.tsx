import { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useAuthStore } from "../../stores/authStore";
import ReviewItem from "./ReviewItem";
import { Link, useLocation } from "react-router";
import ReviewForm from "./ReviewForm";
import {
  reviewApis,
  type PlaceType,
  type Review,
  type ReviewInput,
} from "../../api/review";
import ConfirmModal from "../ConfirmModal";
import LoadingState from "../feedback/LoadingState";
import ErrorState from "../feedback/ErrorState";
import EmptyState from "../feedback/EmptyState";
import { getErrorMessage } from "../../api/errors";

type ReviewSectionProps = {
  placeType: PlaceType;
  placeId: string;
  onStatsChange?: () => void;
};

type Status = "loading" | "success" | "error";

type SortOption = "migliori" | "peggiori" | "recenti" | "vecchie";

const SORT_PARAMS: Record<SortOption, string> = {
  recenti: "createdAt,desc",
  vecchie: "createdAt,asc",
  migliori: "rating,desc",
  peggiori: "rating,asc",
};

const PREVIEW = 3;

const ReviewSection = ({
  placeType,
  placeId,
  onStatsChange,
}: ReviewSectionProps) => {
  const api = reviewApis[placeType];
  const user = useAuthStore((state) => state.user);
  const isVisitor = user?.role === "VISITOR";

  // LA PROPRIA RECENSIONE
  const [myReview, setMyReview] = useState<Review | undefined>(undefined);

  // ALTRE RECENSIONI
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<SortOption>("recenti");
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // STATI PER CREAZIONE, MODIFICA E ELIMINAZIONE
  const location = useLocation();
  const isAdmin = user?.role === "ADMIN";
  const isOwner = user?.role === "OWNER";

  const [isEditing, setIsEditing] = useState(false);
  const [toDelete, setToDelete] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ---- Quante mostrarne (VISTA) ----
  const [isOpen, setIsOpen] = useState(false);

  // LA PROPRIA RECENSIONE SOLO PER VISITATORI
  useEffect(() => {
    if (!isVisitor) return;
    let ignore = false;

    const loadMyReview = async () => {
      try {
        const review = await api.getMine(placeId);
        if (!ignore) setMyReview(review);
      } catch {
        // SE FALLISCE IL VISITATORE VEDE SOLO LA LISTA, NON VALE LA PENA BLOCCARE LA PAGINA
      }
    };

    loadMyReview();
    return () => {
      ignore = true;
    };
  }, [api, placeId, isVisitor]);

  // PRIMA PAGINA DELLA LISTA
  useEffect(() => {
    let ignore = false;

    const loadFirstPage = async () => {
      try {
        const result = await api.getList(placeId, 0, SORT_PARAMS[filter]);
        if (ignore) return;
        setReviews(result.content);
        setReviewCount(result.page.totalElements);
        setPage(0);
        setHasMore(result.page.number + 1 < result.page.totalPages);
        setStatus("success");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(getErrorMessage(err, "Impossibile caricare le recensioni."));
        setStatus("error");
      }
    };

    loadFirstPage();
    return () => {
      ignore = true;
    };
  }, [api, placeId, filter, reloadKey]);

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  // PAGINE SUCCESSIVE
  const loadMore = async () => {
    setLoadingMore(true);
    setActionError(null);
    try {
      const nextPage = page + 1;
      const result = await api.getList(placeId, nextPage, SORT_PARAMS[filter]);
      setReviews((prev) => {
        const alreadyLoaded = new Set(prev.map((r) => r.id));
        return [
          ...prev,
          ...result.content.filter((r) => !alreadyLoaded.has(r.id)),
        ];
      });
      setPage(nextPage);
      setHasMore(result.page.number + 1 < result.page.totalPages);
    } catch (err) {
      setActionError(getErrorMessage(err, "Impossibile caricare le recensioni."));
    } finally {
      setLoadingMore(false);
    }
  };

  // Valori calcolati: decidono cosa mostrare, senza toccare i dati
  const others = reviews.filter((r) => r.id !== myReview?.id);
  const visible = isOpen ? others : others.slice(0, PREVIEW);
  const canExpand = !isOpen && (others.length > PREVIEW || hasMore);

  const handleCreate = async (input: ReviewInput) => {
    const created = await api.create(placeId, input);
    setMyReview(created);
    setReviewCount((count) => count + 1);
    onStatsChange?.();
  };

  const handleUpdate = async (input: ReviewInput) => {
    if (!myReview) return;
    const updated = await api.update(placeId, myReview.id, input);
    setMyReview(updated);
    setIsEditing(false);
    onStatsChange?.();
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await api.remove(placeId, toDelete.id);
      if (toDelete.id === myReview?.id) {
        setMyReview(undefined);
        setIsEditing(false);
      } else {
        setReviews((prev) => prev.filter((r) => r.id !== toDelete.id));
      }
      setReviewCount((count) => Math.max(count - 1, 0));
      onStatsChange?.();
      setToDelete(null);
    } catch (err) {
      setActionError(getErrorMessage(err, "Eliminazione non riuscita. Riprova."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="reviews" className="place-detail__panel">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="place-detail__section-title">
          Recensioni {`(${reviewCount})`}
        </h2>
        <Form.Select
          className="w-auto"
          value={filter}
          onChange={(e) => {
            setIsOpen(false);
            setStatus("loading");
            setFilter(e.target.value as SortOption);
          }}
        >
          <option value="recenti">Più recenti</option>
          <option value="vecchie">Meno recenti</option>
          {placeType === "business" && (
            <>
              <option value="migliori">Migliori</option>
              <option value="peggiori">Peggiori</option>
            </>
          )}
        </Form.Select>
      </div>

      {actionError && <Alert variant="danger">{actionError}</Alert>}

      <div className="mb-4">
        {!user && (
          <p className="text-muted mb-0">
            <Link to="/login" state={{ from: location }}>
              Accedi
            </Link>{" "}
            per scrivere una recensione.
          </p>
        )}

        {isOwner && (
          <p className="text-muted mb-0">
            I proprietari di attività non possono lasciare recensioni.
          </p>
        )}

        {isVisitor && !myReview && (
          <ReviewForm
            placeType={placeType}
            submitLabel="Pubblica recensione"
            onSubmit={handleCreate}
          />
        )}

        {isVisitor && myReview && !isEditing && (
          <ReviewItem
            review={myReview}
            isOwn
            onEdit={() => setIsEditing(true)}
            onDelete={() => setToDelete(myReview)}
          />
        )}

        {isVisitor && myReview && isEditing && (
          <ReviewForm
            placeType={placeType}
            initialValue={{
              text: myReview.text,
              rating: "rating" in myReview ? myReview.rating : 0,
            }}
            submitLabel="Salva modifiche"
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </div>

      {status === "loading" && (
        <LoadingState compact text="Caricamento delle recensioni…" />
      )}

      {status === "error" && (
        <ErrorState compact message={errorMessage} onRetry={handleRetry} />
      )}

      {status === "success" && others.length === 0 && !myReview && (
        <EmptyState compact message="Nessuna recensione ancora." />
      )}

      {status === "success" && visible.length > 0 && (
        <div className="review-list">
          {visible.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              canDelete={isAdmin}
              onDelete={() => setToDelete(review)}
            />
          ))}
        </div>
      )}

      <div className="d-flex flex-column align-items-center gap-2 mt-3">
        {canExpand && (
          <Button variant="outline-primary" onClick={() => setIsOpen(true)}>
            Mostra tutte le recensioni
          </Button>
        )}

        {isOpen && hasMore && (
          <Button
            variant="outline-primary"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Caricamento in corso…" : "Carica altre recensioni"}
          </Button>
        )}

        {isOpen && !hasMore && others.length > PREVIEW && (
          <p className="text-muted small mb-0">
            Hai visto tutte le recensioni.
          </p>
        )}

        {isOpen && (
          <Button variant="link" onClick={() => setIsOpen(false)}>
            Mostra meno
          </Button>
        )}
      </div>
      <ConfirmModal
        show={toDelete !== null}
        title="Eliminare la recensione?"
        children="L'operazione non è reversibile."
        confirmLabel="Elimina"
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
};

export default ReviewSection;
