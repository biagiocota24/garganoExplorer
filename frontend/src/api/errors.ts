import { ApiError } from "./client";

// Messaggio che request() usa quando il backend non manda un "detail"
const GENERIC_API_MESSAGE = "Si è verificato un errore";

/**
 * Trasforma un errore qualsiasi in un messaggio da mostrare all'utente.
 * `fallback` è il messaggio del contesto (es. "Impossibile caricare le attività.").
 */
export const getErrorMessage = (err: unknown, fallback: string): string => {
  // Nessuna risposta dal server: fetch fallita (rete assente, server spento, CORS...)
  if (!(err instanceof ApiError)) {
    return "Impossibile contattare il server. Controlla la connessione e riprova.";
  }

  const { status, message } = err;

  if (status === 401) return "La sessione è scaduta. Accedi di nuovo.";
  if (status === 403) return "Non hai i permessi per questa operazione.";
  if (status === 404) return "Contenuto non trovato.";
  if (status === 400 || status === 409) {
    return message && message !== GENERIC_API_MESSAGE ? message : fallback;
  }
  if (status >= 500) {
    return "Si è verificato un problema sul server. Riprova tra poco.";
  }
  return fallback;
};
