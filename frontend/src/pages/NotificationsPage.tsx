import { useEffect, useState } from "react";
import { Alert, Button, ListGroup, Spinner } from "react-bootstrap";
import { IoCheckmarkDoneOutline, IoNotificationsOffOutline } from "react-icons/io5";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type AppNotification,
} from "../api/notification";
import LoadingSpinner from "../components/Loadingspinner";
import NotificationItem from "../components/notificationItem/NotificationItem";
import { useNotificationStore } from "../stores/noticationStore";

type Filter = "all" | "unread";

const NotificationPage = () => {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  useEffect(() => {
    let ignore = false;

    const loadNotifications = async () => {
      try {
        const result = await getNotifications();
        if (ignore) return;
        setNotifications(result);
        setUnreadCount(result.filter((n) => !n.read).length);
        setStatus("success");
      } catch {
        if (ignore) return;
        setStatus("error");
      }
    };
    loadNotifications();

    return () => {
      ignore = true;
    };
  }, [reloadKey, setUnreadCount]);

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  const handleMarkAsRead = async (id: string) => {
    setBusyId(id);
    setActionError(null);
    try {
      await markNotificationAsRead(id);
      const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      setNotifications(updated);
      setUnreadCount(updated.filter((n) => !n.read).length);
    } catch {
      setActionError("Non è stato possibile aggiornare la notifica. Riprova.");
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    setActionError(null);
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      setActionError("Non è stato possibile aggiornare le notifiche. Riprova.");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <section className="notifications-page">
      <header className="notifications-header">
        <div>
          <h1 className="mb-0">Notifiche</h1>
          {status === "success" && (
            <p>
              {unreadCount > 0
                ? `Hai ${unreadCount} ${unreadCount === 1 ? "notifica" : "notifiche"} da leggere`
                : "Sei in pari: nessuna notifica da leggere"}
            </p>
          )}
        </div>

        {status === "success" && unreadCount > 0 && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="d-inline-flex align-items-center gap-2"
          >
            {isMarkingAll ? (
              <Spinner size="sm" aria-hidden="true" />
            ) : (
              <IoCheckmarkDoneOutline size={18} aria-hidden="true" />
            )}
            Segna tutte come lette
          </Button>
        )}
      </header>

      {actionError && (
        <Alert variant="danger" dismissible onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      {status === "loading" && <LoadingSpinner text="Caricamento in corso..." variant="primary" />}

      {status === "error" && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center gap-3">
          <span>Non è stato possibile caricare le notifiche.</span>
          <Button variant="outline-danger" size="sm" onClick={handleRetry}>
            Riprova
          </Button>
        </Alert>
      )}

      {status === "success" && notifications.length === 0 && (
        <div className="notifications-empty">
          <IoNotificationsOffOutline size={44} aria-hidden="true" />
          <h2>Nessuna notifica</h2>
          <p className="mb-0">Quando ci saranno novità sulle tue attività, le troverai qui.</p>
        </div>
      )}

      {status === "success" && notifications.length > 0 && (
        <>
          <div className="notifications-filter" role="group" aria-label="Filtra le notifiche">
            <button
              type="button"
              className={filter === "all" ? "is-active" : undefined}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Tutte
            </button>
            <button
              type="button"
              className={filter === "unread" ? "is-active" : undefined}
              aria-pressed={filter === "unread"}
              onClick={() => setFilter("unread")}
            >
              Da leggere{unreadCount > 0 && ` (${unreadCount})`}
            </button>
          </div>

          {visible.length === 0 ? (
            <div className="notifications-empty">
              <IoCheckmarkDoneOutline size={44} aria-hidden="true" />
              <h2>Tutto letto</h2>
              <p className="mb-0">Non hai notifiche da leggere.</p>
            </div>
          ) : (
            <ListGroup className="notifications-list">
              {visible.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkAsRead={handleMarkAsRead}
                  isBusy={busyId === n.id}
                />
              ))}
            </ListGroup>
          )}
        </>
      )}
    </section>
  );
};

export default NotificationPage;