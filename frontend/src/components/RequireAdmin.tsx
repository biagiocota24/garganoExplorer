import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";
import LoadingSpinner from "./Loadingspinner";

const RequireAdmin = () => {
  const status = useAuthStore((state) => state.status);
  const role = useAuthStore((state) => state.user?.role);

  if (status === "loading") {
    return <LoadingSpinner text="Caricamento in corso..." variant="primary" />;
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet></Outlet>;
};

export default RequireAdmin;
