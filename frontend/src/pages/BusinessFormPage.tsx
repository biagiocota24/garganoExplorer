import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  businessCategoryTranslations,
  priceRangeDescriptions,
  townTranslations,
} from "../constants/labels";
import { ApiError } from "../api/client";
import LoadingSpinner from "../components/Loadingspinner";
import type { Town } from "../api/types";
import {
  createBusiness,
  getBusinessById,
  updateBusiness,
  type BusinessCategory,
  type BusinessRequest,
  type PriceRange,
} from "../api/business";
import { useAuthStore } from "../stores/authStore";

const MIN_DESCRIPTION = 200;
const MAX_DESCRIPTION = 5000;

const toCoordinate = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  return Number(trimmed);
};

// Campo facoltativo: da stringa vuota converte in null per far passare la validazione
const emptyToNull = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

//aggiunge "https://"
const normalizeWebsite = (value: string): string | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const BusinessFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "notFound" | "error">(
    isEdit ? "loading" : "ready",
  );
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<BusinessCategory | "">("");
  const [town, setTown] = useState<Town | "">("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange | "">("");

  // In modifica: carica l'attività e riempie i campi
  useEffect(() => {
    if (!id) return;
    let ignore = false;

    const loadBusiness = async () => {
      try {
        const business = await getBusinessById(id);
        if (ignore) return;
        setOwnerId(business.ownerId);
        setName(business.name);
        setDescription(business.description);
        setCategory(business.category);
        setTown(business.town);
        setAddress(business.address);
        setLatitude(business.latitude?.toString() ?? "");
        setLongitude(business.longitude?.toString() ?? "");
        setPhone(business.phone ?? "");
        setEmail(business.email ?? "");
        setWebsite(business.website ?? "");
        setPriceRange(business.priceRange ?? "");
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
    loadBusiness();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validazione nel frontend (il backend valida comunque di nuovo)
    const errors: Record<string, string> = {};
    const lat = toCoordinate(latitude);
    const lng = toCoordinate(longitude);

    if (!category) errors.category = "Seleziona una categoria";
    if (!town) errors.town = "Seleziona un comune";
    if (address.trim() === "") errors.address = "Inserisci l'indirizzo";
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

    const request: BusinessRequest = {
      name: name.trim(),
      description: description.trim(),
      category,
      town,
      address: address.trim(),
      latitude: lat,
      longitude: lng,
      phone: emptyToNull(phone),
      email: emptyToNull(email),
      website: normalizeWebsite(website),
      priceRange: priceRange === "" ? null : priceRange,
    };

    try {
      const saved = id ? await updateBusiness(id, request) : await createBusiness(request);
      navigate(`/businesses/${saved.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      } else if (err instanceof ApiError && err.status === 403) {
        setError("Non hai i permessi per modificare questa attività.");
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
          ? "Attività non trovata."
          : "Impossibile caricare l'attività."}{" "}
        <Link to="/my-businesses">Torna alle tue attività</Link>
      </Alert>
    );
  }

  // In modifica: solo il proprietario o l'admin
  const canEdit =
    !isEdit || (!!user && (user.id === ownerId || user.role === "ADMIN"));

  if (!canEdit) {
    return (
      <Alert variant="warning" className="mt-5">
        Non puoi modificare un'attività che non è tua.{" "}
        <Link to="/my-businesses">Torna alle tue attività</Link>
      </Alert>
    );
  }

  const descriptionTooShort = description.trim().length < MIN_DESCRIPTION;

  return (
    <div className="mx-auto" style={{ maxWidth: "760px" }}>
      <h1 className="mb-4">{isEdit ? "Modifica attività" : "Nuova attività"}</h1>

      <Card className="ge-card">
        <Card.Body className="p-4 p-md-5">
          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column gap-3">

            <h2 className="h5 mb-0">Informazioni principali</h2>

            <Form.Group controlId="name">
              <Form.Label>Nome dell'attività</Form.Label>
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

            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BusinessCategory | "")}
                    isInvalid={!!fieldErrors.category}
                    required
                  >
                    <option value="">Seleziona una categoria</option>
                    {Object.entries(businessCategoryTranslations).map(([value, label]) => (
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
              <Col md={6}>
                <Form.Group controlId="priceRange">
                  <Form.Label>Fascia di prezzo</Form.Label>
                  <Form.Select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as PriceRange | "")}
                    isInvalid={!!fieldErrors.priceRange}
                  >
                    <option value="">Non indicata</option>
                    {Object.entries(priceRangeDescriptions).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.priceRange}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

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

            <h2 className="h5 mb-0 mt-3">Posizione</h2>

            <Row className="g-3">
              <Col md={5}>
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
              <Col md={7}>
                <Form.Group controlId="address">
                  <Form.Label>Indirizzo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Via del Porto 12"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    isInvalid={!!fieldErrors.address}
                    maxLength={255}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.address}
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
                    placeholder="41.88"
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
                    placeholder="16.17"
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

            <h2 className="h5 mb-0 mt-3">Contatti</h2>
            <Form.Text className="mt-n2">
              Tutti facoltativi: compariranno nella pagina pubblica dell'attività.
            </Form.Text>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="0884 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    isInvalid={!!fieldErrors.phone}
                    maxLength={20}
                  />
                  <Form.Control.Feedback type="invalid">{fieldErrors.phone}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="info@tuaattivita.it"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!fieldErrors.email}
                    maxLength={255}
                  />
                  <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="website">
              <Form.Label>Sito web</Form.Label>
              <Form.Control
                type="text"
                inputMode="url"
                placeholder="www.tuaattivita.it"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                isInvalid={!!fieldErrors.website}
                maxLength={255}
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.website}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-3">
              <Link
                to={isEdit ? `/businesses/${id}` : "/my-businesses"}
                className="btn btn-outline-secondary"
              >
                Annulla
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvataggio..." : isEdit ? "Salva modifiche" : "Crea attività"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessFormPage;