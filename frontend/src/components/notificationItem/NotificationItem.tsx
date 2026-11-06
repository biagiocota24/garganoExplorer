import { Button, ListGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import {
  IoCheckmarkOutline,
  IoCreateOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import type { AppNotification, NotificationType } from "../../api/notification";
import "./notificationItem.css"

type Props = {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  isBusy?: boolean;
};

// Etichetta e icona per ogni tipo di notifica
const typeConfig: Record<NotificationType, { label: string; Icon: IconType }> =
  {
    BUSINESS_CHANGE_REQUEST: {
      label: "Richiesta di modifica",
      Icon: IoCreateOutline,
    },
  };

const relativeFormatter = new Intl.RelativeTimeFormat("it", {
  numeric: "auto",
});

// "adesso", "5 minuti fa", "2 ore fa", "ieri", poi la data
const formatRelativeTime = (iso: string): string => {
  const diffSeconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSeconds);

  if (abs < 60) return "adesso";
  if (abs < 3600)
    return relativeFormatter.format(Math.round(diffSeconds / 60), "minute");
  if (abs < 86400)
    return relativeFormatter.format(Math.round(diffSeconds / 3600), "hour");
  if (abs < 7 * 86400)
    return relativeFormatter.format(Math.round(diffSeconds / 86400), "day");

  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatFullDate = (iso: string): string =>
  new Date(iso).toLocaleString("it-IT", {
    dateStyle: "full",
    timeStyle: "short",
  });

const NotificationItem = ({
  notification,
  onMarkAsRead,
  isBusy = false,
}: Props) => {
  const { id, type, message, businessId, businessName, read, createdAt } =
    notification;
  const { label, Icon } = typeConfig[type];

  return (
    <ListGroup.Item
      as="article"
      className={`notification-item ${read ? "" : "is-unread"}`}
    >
      <div className="notification-item__icon" aria-hidden="true">
        <Icon size={20} />
      </div>

      <div className="notification-item__body">
        <div className="notification-item__meta">
          {!read && (
            <span className="notification-item__dot" aria-hidden="true" />
          )}
          <span className="notification-item__type">{label}</span>
          <time dateTime={createdAt} title={formatFullDate(createdAt)}>
            {formatRelativeTime(createdAt)}
          </time>
          {!read && <span className="visually-hidden">Non letta</span>}
        </div>

        <p className="notification-item__message">{message}</p>

        {businessId && businessName && (
          <Link
            to={`/businesses/${businessId}`}
            className="notification-item__business"
          >
            <IoStorefrontOutline size={16} aria-hidden="true" />
            {businessName}
          </Link>
        )}
      </div>

      {!read && (
        <Button
          variant="outline-primary"
          size="sm"
          className="notification-item__action"
          onClick={() => onMarkAsRead(id)}
          disabled={isBusy}
          aria-label="Segna come letta"
        >
          {isBusy ? (
            <Spinner size="sm" aria-hidden="true" />
          ) : (
            <>
              <IoCheckmarkOutline size={16} aria-hidden="true" />
              <span className="d-none d-sm-inline">Segna come letta</span>
            </>
          )}
        </Button>
      )}
    </ListGroup.Item>
  );
};

export default NotificationItem;
