import { Navigate } from "react-router-dom";

function ProtectedRoute({children, userData}) {
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
  return isLoggedIn && userData ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute