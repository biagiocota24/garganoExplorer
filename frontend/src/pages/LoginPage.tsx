import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Link, useLocation, useNavigate } from "react-router";
import { ApiError } from "../api/client";
import AuthLayout from "../components/AuthLayout";
import { Alert, Button, Form } from "react-bootstrap";

const LoginPage = function () {
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered === true;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/profile");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossibile contattare il server",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h2>Bentornato</h2>
        <p className="text-secondary">Accedi al tuo account</p>
      </div>
      {justRegistered && (
        <Alert variant="success">Account creato, ora accedi</Alert>
      )}
      {error !== null && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </Form.Group>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Accesso in corso ..." : "Accedi"}
        </Button>
      </Form>
      <p className="text-center mt-4 mb-0">
        Non hai ancora un account? <Link to="/register">Registrati</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
