import { useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { ApiError } from "../api/client";
import { requestBusinessChange } from "../api/notification";

const MAX_MESSAGE = 1000;

type Props = {
  show: boolean;
  businessId: string;
  businessName: string;
  onClose: () => void;
  onSent: () => void;
};

const ChangeRequestModal = ({ show, businessId, businessName, onClose, onSent }: Props) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const trimmed = message.trim();

  const resetAndClose = () => {
    setMessage("");
    setError(null);
    setFieldError(null);
    onClose();
  };

  const handleClose = () => {
    if (isSending) return; // durante l'invio il modale non si chiude
    resetAndClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trimmed === "") return;

    setIsSending(true);
    setError(null);
    setFieldError(null);

    try {
      await requestBusinessChange(businessId, trimmed);
      setIsSending(false);
      resetAndClose();
      onSent();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors?.message) {
        setFieldError(err.fieldErrors.message);
      } else if (err instanceof ApiError && err.status === 404) {
        setError("Questa attività non esiste più.");
      } else if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setError("Non hai i permessi per inviare segnalazioni.");
      } else {
        setError("Invio non riuscito. Riprova tra poco.");
      }
      setIsSending(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={isSending ? "static" : true}
      keyboard={!isSending}
    >
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Header closeButton={!isSending}>
          <div>
            <Modal.Title>Segnala una modifica</Modal.Title>
            <div className="text-body-secondary small">{businessName}</div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <p className="text-body-secondary">
            Il proprietario riceverà una notifica con il tuo messaggio e potrà aggiornare
            l'attività.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group controlId="change-request-message">
            <Form.Label>Messaggio</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_MESSAGE}
              isInvalid={!!fieldError}
              placeholder="Es. la descrizione indica un orario non più valido: puoi verificarlo e aggiornarlo?"
              disabled={isSending}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">{fieldError}</Form.Control.Feedback>
            <Form.Text>
              {trimmed.length} / {MAX_MESSAGE}
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose} disabled={isSending}>
            Annulla
          </Button>
          <Button type="submit" disabled={isSending || trimmed === ""}>
            {isSending ? (
              <>
                <Spinner size="sm" className="me-2" aria-hidden="true" />
                Invio...
              </>
            ) : (
              "Invia segnalazione"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ChangeRequestModal;