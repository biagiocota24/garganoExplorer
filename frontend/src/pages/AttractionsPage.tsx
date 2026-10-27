import { useEffect, useState } from "react";
import {
  getAttractions,
  type Attraction,
  type AttractionCategory,
} from "../api/attraction";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import LoadingSpinner from "../components/Loadingspinner";
import {
  attractionCategoryTranslations,
  townTranslations,
} from "../constants/labels";
import PlaceCard from "../components/placeCard/PlaceCard";
import { NavLink, useSearchParams } from "react-router";
import { useAuthStore } from "../stores/authStore";
import type { Page, Town } from "../api/types";

const AttractionsPage = () => {
  const isAdmin = useAuthStore((state) => state.user?.role === "ADMIN");
  const [data, setData] = useState<Page<Attraction> | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const town = searchParams.get("town") as Town | null;
  const category = searchParams.get("category") as AttractionCategory | null;
  const hasFilters = Boolean(town || category);

  const pageParam = Number(searchParams.get("page"));
  const page = pageParam > 1 ? pageParam - 1 : 0;

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setStatus("loading");
    setSearchParams(next);
  };

  const removeFilters = () => {
    setStatus("loading");
    setSearchParams({});
  };

  const goToPage = (index: number) => {
    const next = new URLSearchParams(searchParams);
    if (index === 0) {
      next.delete("page");
    } else {
      next.set("page", (index + 1).toString());
    }
    setStatus("loading");
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let ignore = false;
    const loadAttractions = async () => {
      try {
        const result = await getAttractions({
          town: town ?? undefined,
          category: category ?? undefined,
          page,
        });
        if (ignore) return;
        setData(result);
        setStatus("success");
      } catch {
        if (ignore) return;
        setStatus("error");
      }
    };
    loadAttractions();

    return () => {
      ignore = true;
    };
  }, [town, category, page]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="mb-3">
          <h1 className="mb-0">Attrazioni</h1>
          <span className="fw-semibold">
            Scegli un comune o una categoria e trova la tua prossima tappa
          </span>
        </div>
        {isAdmin && (
          <NavLink to="/admin/attractions/new" className="btn btn-outline-primary">+ Nuova Attrazione</NavLink>
        )}
      </div>

      <Row className="g-2 align-items-center my-2">
        <Col xs={12} md={4}>
          <Form.Select
            aria-label="Filtra per comune"
            value={town ?? ""}
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
        <Col xs={12} md={4}>
          <Form.Select
            aria-label="Filtra per categoria"
            value={category ?? ""}
            onChange={(e) => updateFilter("category", e.target.value)}
          >
            <option value="">Tutte le categorie</option>
            {Object.entries(attractionCategoryTranslations).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
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

      {status === "error" && (
        <Alert
          variant="danger"
          className="d-flex justify-content-center align-items-center mt-5"
          style={{ height: "200px" }}
        >
          Caricamento attrazioni non riuscito!
        </Alert>
      )}

      {status === "loading" && (
        <LoadingSpinner text="Caricamento in corso..." variant="primary" />
      )}

      {status === "success" && data && data.content.length === 0 && (
        <Alert
          variant="info"
          className="d-flex flex-column justify-content-center align-items-center mt-5"
          style={{ height: "200px" }}
        >
          {hasFilters ? (
            <>
              <span>Nessuna attrazione trovata per:</span>
              <ul className="m-0 mt-2">
                {town && (
                  <li>
                    Comune:{" "}
                    <span className="fw-semibold">
                      {townTranslations[town]}
                    </span>
                  </li>
                )}
                {category && (
                  <li>
                    Categoria:{" "}
                    <span className="fw-semibold">
                      {attractionCategoryTranslations[category]}
                    </span>
                  </li>
                )}
              </ul>
            </>
          ) : (
            "Nessuna attrazione trovata"
          )}
        </Alert>
      )}

      {status === "success" && data && data.content.length > 0 && (
        <>
          <Row xs={1} sm={2} md={3} xl={4} className="g-4 mt-2">
            {data.content.map((a:Attraction) => (
              <Col key={a.id}>
                <PlaceCard
                  to={`/attractions/${a.id}`}
                  title={a.name}
                  subtitle={townTranslations[a.town]}
                  badge={attractionCategoryTranslations[a.category]}
                  description={a.description}
                  tone={a.category}
                />
              </Col>
            ))}
          </Row>
          {data.page.totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <Button
                variant="outline-primary"
                disabled={page === 0}
                onClick={() => goToPage(page - 1)}
              >
                Pagina precedente
              </Button>
              <span>
                Pagina {data.page.number + 1} di {data.page.totalPages}
              </span>
              <Button
                variant="outline-primary"
                disabled={page + 1 >= data.page.totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Pagina successiva
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AttractionsPage;
