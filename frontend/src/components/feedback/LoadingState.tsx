import { Spinner } from "react-bootstrap";
import "./feedback.css";

type LoadingStateProps = {
  text?: string;
  /** Versione ridotta per i pannelli interni */
  compact?: boolean;
};

const LoadingState = ({
  text = "Caricamento in corso…",
  compact = false,
}: LoadingStateProps) => {
  return (
    <div
      className={`feedback-state feedback-state--loading ${compact ? "feedback-state--compact" : ""}`}
      role="status"
      aria-live="polite"
    >
      <Spinner
        animation="border"
        size={compact ? "sm" : undefined}
        className="feedback-state__spinner"
        aria-hidden="true"
      />
      <span>{text}</span>
    </div>
  );
};

export default LoadingState;
