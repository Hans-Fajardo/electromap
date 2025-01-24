import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    return localStorage.getItem("authToken") ? true : false;
  };

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
