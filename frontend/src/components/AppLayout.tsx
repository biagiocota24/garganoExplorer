import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useRef, useState } from "react";
import { useNotificationStore } from "../stores/noticationStore";
import NotificationBell from "./NotificationBell";

const AppLayout = () => {
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const refreshUnreadCount = useNotificationStore(
    (state) => state.refreshUnreadCount,
  );

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

  useEffect(() => {
    if (status !== "authenticated") return;

    refreshUnreadCount();
    const intervalId = setInterval(refreshUnreadCount, 60_000);

    return () => clearInterval(intervalId);
  }, [status, location.pathname, refreshUnreadCount]);

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
          <div className="d-flex align-items-center gap-4 d-lg-none">
            {status === "authenticated" && (
              <Nav.Link
                as={NavLink}
                to="/notifications"
                onClick={() => {
                  setExpanded(false);
                }}
                aria-label={`Notifiche,${unreadCount} non lette`}
              >
                <NotificationBell count={unreadCount} />
              </Nav.Link>
            )}
            <Navbar.Toggle aria-controls="main-navbar" />
          </div>
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
              {user?.role === "OWNER" && (
                <Nav.Link
                  as={NavLink}
                  to="/my-businesses"
                  end
                  onClick={() => {
                    setExpanded(false);
                  }}
                >
                  Le mie attività
                </Nav.Link>
              )}
            </Nav>

            {/* Parte destra: dipende da chi è loggato */}
            {status === "authenticated" && user && (
              <Nav className="align-items-lg-center gap-2">
                <Nav.Link
                  as={NavLink}
                  to="/notifications"
                  className="d-none d-lg-block"
                  onClick={() => {
                    setExpanded(false);
                  }}
                  aria-label={`Notifiche,${unreadCount} non lette`}
                >
                  <NotificationBell count={unreadCount} />
                </Nav.Link>
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
