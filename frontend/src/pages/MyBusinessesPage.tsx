import { useEffect, useState } from "react";
import { getMyBusinesses, type Business } from "../api/business";
import { Link, useNavigate } from "react-router";
import { Alert, Button, Col, Row } from "react-bootstrap";
import LoadingSpinner from "../components/Loadingspinner";
import PlaceCard from "../components/placeCard/PlaceCard";
import {
  businessCategoryTranslations,
  priceRangeDescriptions,
  townTranslations,
} from "../constants/labels";

const MyBusinessesPage = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );

  useEffect(() => {
    let ignore = false;
    const loadMyBusinesses = async () => {
      try {
        const result = await getMyBusinesses();
        if (ignore) return;
        setBusinesses(result);
        setStatus("success");
      } catch {
        if (ignore) return;
        setStatus("error");
      }
    };

    loadMyBusinesses();

    return () => {
      ignore = true;
    };
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="mb-3">
          <h1 className="mb-0">Le mie attività</h1>
        </div>
        <Link to="/my-businesses/new" className="btn btn-outline-primary">
          + Aggiungi Attività
        </Link>
      </div>
      {status === "error" && (
        <Alert
          variant="danger"
          className="d-flex justify-content-center align-items-center mt-5 max-width-hero-card m-auto"
          style={{ height: "200px" }}
        >
          Caricamento attività non riuscito!
        </Alert>
      )}
      {status === "loading" && (
        <LoadingSpinner
          text="Caricamento attività in corso..."
          variant="primary"
        />
      )}
      {status === "success" && businesses.length === 0 && (
        <div
          className="ge-card d-flex flex-column gap-5 align-items-center p-5 mt-5 m-auto max-width-hero-card"
        >
          <h2 className="text-primary text-center">
            Non hai registrato ancora nessuna attività.
          </h2>
          <Button onClick={() => navigate("/my-businesses/new")}>
            Registra la tua prima attività
          </Button>
        </div>
      )}
      {status === "success" && businesses && businesses.length > 0 && (
        <Row xs={1} sm={2} md={3} xl={4} className="g-4 mt-2">
          {businesses.map((b: Business) => (
            <Col key={b.id}>
                <PlaceCard
                  to={`/businesses/${b.id}`}
                  title={b.name}
                  subtitle={townTranslations[b.town]}
                  badge={businessCategoryTranslations[b.category]}
                  description={b.description}
                  tone={b.category}
                  extra={b.priceRange && priceRangeDescriptions[b.priceRange]}
                />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default MyBusinessesPage;
