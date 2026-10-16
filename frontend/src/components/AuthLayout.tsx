import type { ReactNode } from "react";
import { Card } from "react-bootstrap";

type AuthLayoutProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="d-flex min-vh-100 animate-in">
      {/* Pannello sinistro: solo su schermi grandi */}
      <div className="auth-hero d-none d-lg-flex flex-column justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <span className="auth-logo">🧭</span>
          <span className="fs-4 fw-bold" style={{ fontFamily: "Outfit" }}>
            Garga<span className="text-danger">no</span>
            <span className="text-success">Yes</span>
          </span>
        </div>
        <div style={{ maxWidth: 460 }}>
          <h1 className="auth-hero-title mb-3">
            Scopri il Gargano, un'onda alla volta.
          </h1>
          <p className="fs-5 opacity-75 mb-0">
            Spiagge, borghi e sentieri raccontati da chi vive il territorio.
          </p>
        </div>

        <div />
      </div>

      {/* Colonna destra: la card con il form */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3 p-md-4">
        <Card className="auth-card">
          <Card.Body className="p-4 p-md-5">
            {/* Logo, solo su mobile */}
            <div className="d-flex d-lg-none align-items-center gap-2 mb-4">
              <span className="auth-logo">🧭</span>
              <span
                className="fw-bold"
                style={{ fontFamily: "Outfit", color: "var(--ge-primary)" }}
              >
                Garga<span className="text-danger">no</span>
                <span className="text-success">Yes</span>
              </span>
            </div>
            {children}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default AuthLayout;
