import { useAuthStore } from "../stores/authStore";
import { Link } from "react-router";

const HomePage = function () {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  return (
    <section className="home-hero mt-5 max-width-hero-card m-auto">
      <h1 className="auth-hero-title">Scopri il Gargano, un passo alla volta</h1>
      <p className="lead mb-4">
        La piattaforma GarganoYes ti accompagna passo passo alla scoperta di
        questo bellissimo territorio. Esplora qui le principali attrazioni e
        qualsiasi info sul territorio
      </p>
      {status === "anonymous" && (
        <div className="d-flex flex-wrap gap-2">
          <Link to="/register" className="btn btn-light btn-lg">
            Crea un account
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg">
            Accedi
          </Link>
        </div>
      )}
      {status === "authenticated" && user && (
        <div>
          <h3 className="text-light mb-3">Ciao {user.firstName}</h3>
          <Link className="btn btn-light btn-lg" to="/profile">
            Vai al profilo
          </Link>
        </div>
      )}
    </section>
  );
};

export default HomePage;
