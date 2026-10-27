import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useRef, useState } from "react";

const AppLayout = () => {
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    setExpanded(false);
    navigate("/login");
  };

  useEffect(() => {
    if (!expanded) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [expanded]);

  return (
    <>
      <Navbar
        ref={navRef}
        expanded={expanded}
        onToggle={setExpanded}
        expand="lg"
        sticky="top"
        className="app-navbar"
      >
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center gap-2"
          >
            <span className="auth-logo">🧭</span>
            <span className="brand-text">
              Garga<span className="text-danger">no</span>
              <span className="text-success">Yes</span>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link
                as={NavLink}
                to="/"
                end
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/attractions"
                end
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Attrazioni
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/businesses"
                end
                onClick={() => {
                  setExpanded(false);
                }}
              >
                Attività
              </Nav.Link>
            </Nav>

            {/* Parte destra: dipende da chi è loggato */}
            {status === "authenticated" && user && (
              <Nav className="align-items-lg-center gap-2">
                <Nav.Link as={NavLink} to="/profile">
                  {user.firstName}
                </Nav.Link>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Esci
                </Button>
              </Nav>
            )}

            {status === "anonymous" && (
              <Nav className="align-items-lg-center gap-2">
                <Nav.Link as={NavLink} to="/login">
                  Accedi
                </Nav.Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Registrati
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="py-4">
        <Container fluid className="animate-in">
          <Outlet />
        </Container>
      </main>
    </>
  );
};

export default AppLayout;
