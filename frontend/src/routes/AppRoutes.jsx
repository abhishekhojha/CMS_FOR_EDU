import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/HomePage";
import PagesList from '@/pages/PagesList';
// import Contact from '@/pages/Contact';
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/Sidebar";
import { useSelector } from "react-redux";
import TopBar from "@/components/ui/TopBar";
import CreatePage from "@/pages/CreatePage";

function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    // ${isAuthenticated ? 'lg:ml-64' : ''}
    // <Router>
      <div className="flex">
      {isAuthenticated && <Sidebar />}
      <div className="w-full lg:flex-1">
        {isAuthenticated && <TopBar />}
        <div className={`pt-16 p-6`}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/pages" element={<PagesList />} />
              <Route path="/create-pages" element={<CreatePage />} />

              {/* <Route path="/about" element={<About />} /> */}
              {/* <Route path="/contact" element={<Contact />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    // </Router>
  );
}

export default AppRoutes;
