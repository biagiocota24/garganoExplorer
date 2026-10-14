import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { Link, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RequireAuth from "./components/RequireAuth";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./components/AppLayout";

function App() {
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);
  return (
    <>
      {/* <Link to={"/"}>Home</Link>
      <Link to={"/login"}>login</Link>
      <Link to={"/register"}>register</Link>
      <Link to={"/profile"}>profile</Link> */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
