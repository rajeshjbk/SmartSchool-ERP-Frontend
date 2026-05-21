import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("jwtToken");

  const userRole = localStorage.getItem("userRole");

  // Not Logged In
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role Check
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
