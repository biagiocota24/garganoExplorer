import { Button, ListGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import {
  IoCheckmarkOutline,
  IoCreateOutline,
  IoStarOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import type { AppNotification, NotificationType } from "../../api/notification";
import "./notificationItem.css"
import { formatFullDateNotification, formatRelativeTimeNotification } from "../../utils/dates";

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
    NEW_REVIEW: {
      label: "Nuova recensione",
      Icon: IoStarOutline,
    },
  };


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
          <time dateTime={createdAt} title={formatFullDateNotification(createdAt)}>
            {formatRelativeTimeNotification(createdAt)}
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
