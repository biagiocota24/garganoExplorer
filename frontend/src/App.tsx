import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import {  Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequireAuth from "./components/RequireAuth";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./components/AppLayout";
import AttractionsPage from "./pages/AttractionsPage";

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
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
