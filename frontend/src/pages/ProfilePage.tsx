import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/authStore";

const ProfilePage = function () {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <h2>
        {user.firstName} {user.lastName}
      </h2>
      <p>{user.email}</p>
      <p>{user.role}</p>
      <p>Data di iscrizione {user.createdAt}</p>

      <button onClick={handleLogout}>Esci</button>
    </>
  );
};

export default ProfilePage;
