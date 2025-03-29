import Sidebar from "@/components/ui/Sidebar";
import TopBar from "@/components/ui/TopBar";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    user.role == "admin" ? (
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className="w-full lg:flex-1">
          {isAuthenticated && <TopBar />}
          <div className="pt-[85px] md:pt-16 p-3 md:p-6 lg:max-h-screen lg:overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    ) : (
      <Navigate to="/restricted" />
    )
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute;
