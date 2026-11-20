import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router";
import { IoArrowBack, IoRefresh } from "react-icons/io5";
import "./feedback.css";

type ErrorStateProps = {
  message: string;
  /** Se presente mostra il pulsante "Riprova" */
  onRetry?: () => void;
  /** Se presente (insieme a backLabel) mostra il link "Torna a …" */
  backTo?: string;
  backLabel?: string;
  compact?: boolean;
};

const ErrorState = ({
  message,
  onRetry,
  backTo,
  backLabel,
  compact = false,
}: ErrorStateProps) => {
  const showBack = Boolean(backTo && backLabel);

  return (
    <Alert
      variant="danger"
      role="alert"
      className={`feedback-state feedback-state--error ${compact ? "feedback-state--compact" : ""}`}
    >
      <span>{message}</span>
      {(onRetry || showBack) && (
        <div className="feedback-state__actions">
          {showBack && (
            <Link to={backTo!} className="feedback-state__link">
              <IoArrowBack aria-hidden="true" />
              {backLabel}
            </Link>
          )}
          {onRetry && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onRetry}
              className="d-inline-flex align-items-center gap-2"
            >
              <IoRefresh aria-hidden="true" />
              Riprova
            </Button>
          )}
        </div>
      )}
    </Alert>
  );
};

export default ErrorState;
