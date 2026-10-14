import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStore";

const AppLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar expand="lg" sticky="top" className="app-navbar">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center gap-2"
          >
            <span className="auth-logo">🧭</span>
            <span className="brand-text">GarganoExplorer</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>
                Home
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
                <Button as={Link} to="/register" size="sm">
                  Registrati
                </Button>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="py-4">
        <Container className="animate-in">
          <Outlet />
        </Container>
      </main>
    </>
  );
};

export default AppLayout;
