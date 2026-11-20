import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import "./feedback.css";

type EmptyStateProps = {
  message: string;
  title?: string;
  icon?: IconType;
  /** Contenuto extra sotto il messaggio (es. elenco dei filtri attivi) */
  children?: ReactNode;
  /** Azione facoltativa (es. pulsante "Azzera filtri") */
  action?: ReactNode;
  compact?: boolean;
};

const EmptyState = ({
  message,
  title,
  icon: Icon,
  children,
  action,
  compact = false,
}: EmptyStateProps) => {
  return (
    <div
      className={`feedback-state feedback-state--empty ${compact ? "feedback-state--compact" : ""}`}
    >
      {Icon && (
        <Icon size={44} className="feedback-state__icon" aria-hidden="true" />
      )}
      {title && <p className="feedback-state__title">{title}</p>}
      <p className="feedback-state__message">{message}</p>
      {children && <div className="feedback-state__extra">{children}</div>}
      {action && <div className="feedback-state__actions">{action}</div>}
    </div>
  );
};

export default EmptyState;
