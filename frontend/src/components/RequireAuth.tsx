import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";

const RequireAuth = () => {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <h1>Caricamento in corso</h1>;
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet></Outlet>;
};

export default RequireAuth;
