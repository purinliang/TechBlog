import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../UserContext";

export default function ProtectedRoute({ children }) {
  const { username } = useUser();
  const location = useLocation();

  if (!username) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
}
