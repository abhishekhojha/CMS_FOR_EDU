import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log("hello");
  
  return isAuthenticated ? (
    user.role == "admin" ? (
      children
    ) : (
      <Navigate to="/restricted" />
    )
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute;
