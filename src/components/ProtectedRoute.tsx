import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../utils/auth";
import type { UserRole } from "../utils/auth";

interface ProtectedRouteProps {
  allowedRole?: UserRole;
}

function ProtectedRoute({
  allowedRole,
}: ProtectedRouteProps) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;