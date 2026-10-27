import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequireAuth from "./components/RequireAuth";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./components/AppLayout";
import AttractionsPage from "./pages/AttractionsPage";
import AttractionDetailsPage from "./pages/AttractionDetailsPage";
import AttractionFormPage from "./pages/AttractionFormPage";
import RequireRole from "./components/RequireRole";
import BusinessesPage from "./pages/BusinessesPage";
import BusinessDetailsPage from "./pages/BusinessDetailPage";
import MyBusinessesPage from "./pages/MyBusinessesPage";
import BusinessFormPage from "./pages/BusinessFormPage";

function App() {
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/attractions/:id" element={<AttractionDetailsPage />} />
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/businesses/:id" element={<BusinessDetailsPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route element={<RequireRole roles={["ADMIN"]} />}>
            <Route
              path="/admin/attractions/new"
              element={<AttractionFormPage />}
            />
            <Route
              path="/admin/attractions/:id/edit"
              element={<AttractionFormPage />}
            />
          </Route>
          <Route element={<RequireRole roles={["OWNER"]} />}>
            <Route
              path="/my-businesses"
              element={<MyBusinessesPage />}
            />
            <Route
              path="/my-businesses/new"
              element={<BusinessFormPage />}
            />
            <Route
              path="/my-businesses/:id/edit"
              element={<BusinessFormPage />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
