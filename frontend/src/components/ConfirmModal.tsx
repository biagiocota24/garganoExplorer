import type { ReactNode } from "react";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";

type Props = {
  show: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  confirmVariant?: string;
  isProcessing?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({
  show,
  title,
  children,
  confirmLabel = "Conferma",
  confirmVariant = "danger",
  isProcessing = false,
  error = null,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop={isProcessing ? "static" : true}
      keyboard={!isProcessing}
    >
      <Modal.Header closeButton={!isProcessing}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {children}
        {error && (
          <Alert variant="danger" className="mt-3 mb-0">
            {error}
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Annulla
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Spinner size="sm" className="me-2" aria-hidden="true" />
              Attendere...
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
