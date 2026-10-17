import { Link, useNavigate } from "react-router";
import type { AccountType } from "../api/auth";
import { useState } from "react";
import * as auth from "../api/auth";
import { ApiError } from "../api/client";
import AuthLayout from "../components/AuthLayout";
import { Alert, Button, Form } from "react-bootstrap";

const RegisterPage = function () {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(
    null,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("VISITOR");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors(null);
    setError(null);
    setIsSubmitting(true);
    try {
      await auth.register({
        email,
        password,
        firstName,
        lastName,
        accountType,
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fieldErrors ?? null);
      } else {
        setError("Impossibile contattare il server");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h2>Crea il tuo account</h2>
      <p className="text-secondary">Inizia ad esplorare il Gargano</p>
      {error !== null && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleRegister} className="d-flex flex-column gap-3">
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!fieldErrors?.email}
            required
            autoComplete="email"
          />
          <Form.Control.Feedback type="invalid">
            {fieldErrors?.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            minLength={8}
            maxLength={72}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!fieldErrors?.password}
            required
            autoComplete="new-password"
          />
          <Form.Text>Almeno 8 caratteri</Form.Text>
          <Form.Control.Feedback type="invalid">
            {fieldErrors?.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="firstName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            isInvalid={!!fieldErrors?.firstName}
            required
            autoComplete="given-name"
          />
          <Form.Control.Feedback type="invalid">
            {fieldErrors?.firstName}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            isInvalid={!!fieldErrors?.lastName}
            required
            autoComplete="family-name"
          />
          <Form.Control.Feedback type="invalid">
            {fieldErrors?.lastName}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="accountType">
          <Form.Label>Tipo di account</Form.Label>
          <Form.Select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as AccountType)}
          >
            <option value="VISITOR">Visitatore</option>
            <option value="OWNER">Gestore</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrazione in corso..." : "Registrati"}
        </Button>
      </Form>
      <p className="text-center mt-4 mb-0">
        Hai già un account? <Link to="/login">Accedi</Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
