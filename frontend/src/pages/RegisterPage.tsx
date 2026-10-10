import { useNavigate } from "react-router";
import type { AccounType } from "../api/auth";
import { useState } from "react";
import * as auth from "../api/auth";
import { ApiError } from "../api/client";

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
  const [accountType, setAccountType] = useState<AccounType>("VISITOR");

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
      navigate("/login", { state: { registred: true } });
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
    <>
      <form onSubmit={handleRegister}>
        <label htmlFor="email">email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          required
          autoComplete="email"
        />
        {fieldErrors?.email && <p>{fieldErrors.email}</p>}
        <label htmlFor="password">password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          required
          autoComplete="new-password"
        />
        {fieldErrors?.password && <p>{fieldErrors.password}</p>}
        <label htmlFor="nome">nome</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          id="nome"
          required
          autoComplete="given-name"
        />
        {fieldErrors?.firstName && <p>{fieldErrors.firstName}</p>}
        <label htmlFor="cognome">cognome</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          id="cognome"
          required
          autoComplete="family-name"
        />
        {fieldErrors?.lastName && <p>{fieldErrors.lastName}</p>}
        <label htmlFor="role">Tipo di account</label>
        <select
          id="role"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value as AccounType)}
        >
          <option value="VISITOR">Visitatore</option>
          <option value="OWNER">Gestore</option>
        </select>
        {error !== null && <p role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrazione in corso..." : "Registrati"}
        </button>
      </form>
    </>
  );
};

export default RegisterPage;
