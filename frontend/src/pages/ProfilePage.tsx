import type { Role } from "../api/auth";
import { useAuthStore } from "../stores/authStore";
import { Card } from "react-bootstrap";

const roleLabels: Record<Role, string> = {
  VISITOR: "Visitatore",
  OWNER: "Gestore",
  ADMIN: "Amministratore",
};

const ProfilePage = function () {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const creationDate = new Date(user.createdAt).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto" style={{ maxWidth: "640px" }}>
      <Card className="ge-card">
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex align-items-center justify-content-center gap-3">
            <div className="avatar">{initials}</div>
            <div className="d-flex flex-column align-items-start gap-1">
              <h3 className="m-0">
                {user.firstName} {user.lastName}
              </h3>
              <span className="text-secondary">{user.email}</span>
              <span className="role-badge">{roleLabels[user.role]}</span>
            </div>
          </div>
          <div className="d-flex flex-column gap-3 mt-5">
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Email</span>
              <span className="fw-medium">{user.email}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-secondary">Tipo di account</span>
              <span className="fw-medium">{roleLabels[user.role]}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-secondary">Iscritto dal</span>
              <span className="fw-medium">{creationDate}</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePage;
