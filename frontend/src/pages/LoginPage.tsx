import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Link, useNavigate } from "react-router";
import { ApiError } from "../api/client";

const LoginPage = function () {
  const navigate = useNavigate();

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
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          required
          autoComplete="email"
        />
        <label htmlFor="password">password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          required
          autoComplete="current-password"
        />
        {error !== null && <p role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Accesso in corso" : "Accedi"}
        </button>
      </form>
      <p>Non hai ancora un account ?</p>
      <Link to={"/register"}>Registrati</Link>
    </>
  );
};

export default LoginPage;
