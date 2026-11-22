import { useEffect, useState, type MouseEvent } from "react";
import type { PlaceType } from "../../api/review";
import { getErrorMessage } from "../../api/errors";
import { useAuthStore } from "../../stores/authStore";
import { useFavoriteStore } from "../../stores/favoriteStore";
import "./favoriteButton.css";
import { useNavigate } from "react-router";

type FavoriteButtonProps = {
  type: PlaceType;
  id: string;
  variant?: "overlay" | "inline";
};

export default function FavoriteButton({
  type,
  id,
  variant = "inline",
}: FavoriteButtonProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");
  const toggle = useFavoriteStore((s) => s.toggle);
  const isFavorite = useFavoriteStore((s) =>
    type === "business" ? s.businessIds.has(id) : s.attractionIds.has(id),
  );

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // L'errore sparisce da solo dopo 3 secondi
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    // Evita che il click apra il dettaglio quando il bottone è dentro una card-link
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsPending(true);
    setError(null);
    try {
      await toggle(type, id);
    } catch (err) {
      setError(getErrorMessage(err, "Impossibile aggiornare i preferiti."));
    } finally {
      setIsPending(false);
    }
  };

  const label = isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti";

  return (
    <span className={`favorite-button-wrapper favorite-button-wrapper--${variant}`}>
      <button
        type="button"
        className={`favorite-button favorite-button--${variant}${
          isFavorite ? " is-active" : ""
        }`}
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={isFavorite}
        aria-label={label}
        title={label}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="favorite-button__icon">
          <path d="M12 21s-6.7-4.35-9.33-8.1C.8 10.2 1.6 6.6 4.5 5.2c2.2-1.06 4.7-.3 6.1 1.5L12 8.3l1.4-1.6c1.4-1.8 3.9-2.56 6.1-1.5 2.9 1.4 3.7 5 1.83 7.7C18.7 16.65 12 21 12 21z" />
        </svg>
        {variant === "inline" && (
          <span className="favorite-button__text">
            {isFavorite ? "Nei preferiti" : "Salva"}
          </span>
        )}
      </button>

      {error && (
        <span className="favorite-button__error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}