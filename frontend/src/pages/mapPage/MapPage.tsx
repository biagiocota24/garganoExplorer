import { useEffect, useMemo, useState } from "react";
import { getDetailsPlace, getMapPlaces, type MapPlace } from "../../api/map";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router";
import LoadingState from "../../components/feedback/LoadingState";
import ErrorState from "../../components/feedback/ErrorState";
import EmptyState from "../../components/feedback/EmptyState";
import { getErrorMessage } from "../../api/errors";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./MapPage.css";
import { getMarkerIcon } from "../../components/map/markerIcons";
import { optimizedImage } from "../../utils/cloudinary";
import {
  attractionCategoryTranslations,
  businessCategoryTranslations,
  townTranslations,
} from "../../constants/labels";
import FitBounds from "../../components/map/FitBounds";
import FocusPlace from "../../components/map/FocusPlace";

const GARGANO_CENTER: [number, number] = [41.8, 15.8];
const DEFAULT_ZOOM = 10;

const MapPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const town = searchParams.get("town") ?? "";
  const category = searchParams.get("category") ?? "";

  const type = searchParams.get("type") ?? "";
  const query = searchParams.get("query") ?? "";
  const [reloadKey, setReloadKey] = useState(0);

  const focus = searchParams.get("focus") ?? "";

  const focusedPlace = useMemo(() => {
    return places.find((place) => place.id === focus);
  }, [focus, places]);

  const hasFilters = Boolean(town || category || type || query);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("focus");
    setSearchParams(next);
  };

  const removeFilters = () => {
    setSearchParams({});
  };

  const filteredPlaces = useMemo(() => {
    const search = query.trim().toLowerCase();

    return places.filter((place) => {
      if (search && !place.name.toLowerCase().includes(search)) return false;
      if (town && place.town !== town) return false;
      if (category && place.category !== category) return false;
      if (type && place.type !== type) return false;
      return true;
    });
  }, [type, category, town, query, places]);

  useEffect(() => {
    let ignore = false;

    const loadPlaces = async () => {
      setStatus("loading");
      try {
        const result = await getMapPlaces();
        if (ignore) return;
        setPlaces(result);
        setStatus("success");
      } catch (err) {
        if (ignore) return;
        setErrorMessage(getErrorMessage(err, "Impossibile caricare la mappa."));
        setStatus("error");
      }
    };

    loadPlaces();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  return (
    <>
      <div className="mb-3">
        <h1 className="mb-0">Trova i luoghi che ti interessano sulla mappa</h1>
      </div>
      <Row className="g-2 align-items-center my-2" xs={2} lg={5} xl={6}>
        <Col>
          <Form.Control
            placeholder="Cerca qui"
            value={query}
            onChange={(e) => updateFilter("query", e.target.value)}
          />
        </Col>
        <Col>
          <Form.Select
            aria-label="Filtra per comune"
            value={town}
            onChange={(e) => updateFilter("town", e.target.value)}
          >
            <option value="">Tutti i comuni</option>
            {Object.entries(townTranslations).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select
            aria-label="Filtra per categoria"
            value={category}
            onChange={(e) => updateFilter("category", e.target.value)}
          >
            <option value="">Tutte le categorie</option>
            {Object.entries(businessCategoryTranslations).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
            {Object.entries(attractionCategoryTranslations).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select
            aria-label="Filtra per tipologia struttura"
            value={type}
            onChange={(e) => updateFilter("type", e.target.value)}
          >
            <option value="">Tutte le tipologie</option>
            <option value="ATTRACTION">Attrazione</option>
            <option value="BUSINESS">Attività</option>
          </Form.Select>
        </Col>
        {hasFilters && (
          <Col xs={12} md="auto">
            <Button variant="outline-secondary" onClick={removeFilters}>
              Azzera filtri
            </Button>
          </Col>
        )}
      </Row>
      {status === "loading" && <LoadingState />}
      {status === "error" && (
        <ErrorState
          message={errorMessage}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      )}
      {status === "success" && places.length === 0 && (
        <EmptyState message="Nessun luogo da mostrare sulla mappa." />
      )}
      {status === "success" &&
        places.length > 0 &&
        filteredPlaces.length === 0 && (
          <EmptyState
            compact
            message="Nessun luogo trovato con i filtri selezionati."
            action={
              <Button variant="outline-secondary" onClick={removeFilters}>
                Azzera filtri
              </Button>
            }
          />
        )}
      {status === "success" && places.length > 0 && (
        <div className="map-page_mappa">
          <MapContainer
            center={GARGANO_CENTER}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {focusedPlace ? (
              <FocusPlace place={focusedPlace} />
            ) : (
              <FitBounds places={filteredPlaces} />
            )}

            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.latitude, place.longitude]}
                icon={getMarkerIcon(place.type)}
                eventHandlers={
                  place.id === focusedPlace?.id
                    ? { add: (event) => event.target.openPopup() }
                    : undefined
                }
              >
                <Popup>
                  <div className="d-flex flex-column">
                    {place.coverPhotoUrl && (
                      <img
                        src={optimizedImage(place.coverPhotoUrl, 240, 140)}
                        alt={place.name}
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <strong
                      className={place.coverPhotoUrl ? "fs-5 mt-1" : "fs-5"}
                    >
                      {place.name}
                    </strong>
                    <div className="d-flex justify-content-between align-items-center fs-6 text-success  gap-2">
                      <Link to={getDetailsPlace(place)} className="fs-6">
                        Vedi di più
                      </Link>
                      <span>{townTranslations[place.town]}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </>
  );
};

export default MapPage;
