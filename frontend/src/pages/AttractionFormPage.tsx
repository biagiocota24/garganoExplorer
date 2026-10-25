import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  attractionCategoryTranslations,
  townTranslations,
} from "../constants/labels";
import {
  createAttraction,
  getAttractionById,
  updateAttraction,
  type AttractionCategory,
  type AttractionRequest,
  type Town,
} from "../api/attraction";
import { ApiError } from "../api/client";
import LoadingSpinner from "../components/Loadingspinner";

const MIN_DESCRIPTION = 200;
const MAX_DESCRIPTION = 5000;

const toCoordinate = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  return Number(trimmed);
};

const AttractionFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loadStatus, setLoadStatus] = useState<
    "loading" | "ready" | "notFound" | "error"
  >(isEdit ? "loading" : "ready");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [town, setTown] = useState<Town | "">("");
  const [category, setCategory] = useState<AttractionCategory | "">("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // In modifica: carica l'attrazione e riempie i campi
  useEffect(() => {
    if (!id) return;
    let ignore = false;

    const loadAttraction = async () => {
      try {
        const attraction = await getAttractionById(id);
        if (ignore) return;
        setName(attraction.name);
        setDescription(attraction.description);
        setTown(attraction.town);
        setCategory(attraction.category);
        setLatitude(attraction.latitude?.toString() ?? "");
        setLongitude(attraction.longitude?.toString() ?? "");
        setLoadStatus("ready");
      } catch (err) {
        if (ignore) return;
        if (err instanceof ApiError && err.status === 404) {
          setLoadStatus("notFound");
        } else {
          setLoadStatus("error");
        }
      }
    };
    loadAttraction();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 1. Validazione nel frontend (il backend valida comunque di nuovo)
    const errors: Record<string, string> = {};
    const lat = toCoordinate(latitude);
    const lng = toCoordinate(longitude);

    if (!town) errors.town = "Seleziona un comune";
    if (!category) errors.category = "Seleziona una categoria";
    if (lat !== null && Number.isNaN(lat)) {
      errors.latitude = "Inserisci un numero valido (es. 41.72)";
    }
    if (lng !== null && Number.isNaN(lng)) {
      errors.longitude = "Inserisci un numero valido (es. 16.06)";
    }

    if (Object.keys(errors).length > 0 || !town || !category) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const request: AttractionRequest = {
      name: name.trim(),
      description: description.trim(),
      town,
      category,
      latitude: lat,
      longitude: lng,
    };

    try {
      const saved = id
        ? await updateAttraction(id, request)
        : await createAttraction(request);
      navigate(`/attractions/${saved.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      } else if (err instanceof ApiError && err.status === 403) {
        setError("Non hai i permessi per questa operazione.");
      } else {
        setError("Salvataggio non riuscito. Riprova tra poco.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadStatus === "loading") {
    return <LoadingSpinner text="Caricamento in corso..." variant="primary" />;
  }

  if (loadStatus === "notFound" || loadStatus === "error") {
    return (
      <Alert variant={loadStatus === "notFound" ? "info" : "danger"} className="mt-5">
        {loadStatus === "notFound"
          ? "Attrazione non trovata."
          : "Impossibile caricare l'attrazione."}{" "}
        <Link to="/attractions">Torna alle attrazioni</Link>
      </Alert>
    );
  }

  const descriptionTooShort = description.trim().length < MIN_DESCRIPTION;

  return (
    <div className="mx-auto" style={{ maxWidth: "720px" }}>
      <h1 className="mb-4">{isEdit ? "Modifica attrazione" : "Nuova attrazione"}</h1>

      <Card className="ge-card">
        <Card.Body className="p-4 p-md-5">
          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <Form.Group controlId="name">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!fieldErrors.name}
                maxLength={150}
                required
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                isInvalid={!!fieldErrors.description}
                maxLength={MAX_DESCRIPTION}
                required
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.description}
              </Form.Control.Feedback>
              <Form.Text className={descriptionTooShort ? "text-danger" : undefined}>
                {description.trim().length} / {MAX_DESCRIPTION} — minimo {MIN_DESCRIPTION} caratteri
              </Form.Text>
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="town">
                  <Form.Label>Comune</Form.Label>
                  <Form.Select
                    value={town}
                    onChange={(e) => setTown(e.target.value as Town | "")}
                    isInvalid={!!fieldErrors.town}
                    required
                  >
                    <option value="">Seleziona un comune</option>
                    {Object.entries(townTranslations).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{fieldErrors.town}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AttractionCategory | "")}
                    isInvalid={!!fieldErrors.category}
                    required
                  >
                    <option value="">Seleziona una categoria</option>
                    {Object.entries(attractionCategoryTranslations).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="latitude">
                  <Form.Label>Latitudine</Form.Label>
                  <Form.Control
                    type="text"
                    inputMode="decimal"
                    placeholder="41.72"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    isInvalid={!!fieldErrors.latitude}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.latitude}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="longitude">
                  <Form.Label>Longitudine</Form.Label>
                  <Form.Control
                    type="text"
                    inputMode="decimal"
                    placeholder="16.06"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    isInvalid={!!fieldErrors.longitude}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.longitude}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Text className="mt-n2">
              Facoltative. Su Google Maps: tasto destro sul punto → clicca sulle coordinate per
              copiarle.
            </Form.Text>

            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-2">
              <Link
                to={isEdit ? `/attractions/${id}` : "/attractions"}
                className="btn btn-outline-secondary"
              >
                Annulla
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvataggio..." : isEdit ? "Salva modifiche" : "Crea attrazione"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AttractionFormPage;