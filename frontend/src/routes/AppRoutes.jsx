import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/HomePage";
import PagesList from "@/pages/PagesList";
// import Contact from '@/pages/Contact';
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/Sidebar";
import { useSelector } from "react-redux";
import TopBar from "@/components/ui/TopBar";
import CreatePage from "@/pages/CreatePage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Welcome from "@/pages/Welcome";
import SectionManagement from "@/pages/PageSections";

function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Welcome />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <ProtectedRoute>
        <div className="flex">
          {isAuthenticated && <Sidebar />}
          <div className="w-full lg:flex-1">
            {isAuthenticated && <TopBar />}
            <div className={`pt-16 p-6`}>
              <Routes>
                <Route path="/dashboard" element={<Home />} />
                <Route path="/pages" element={<PagesList />} />
                <Route path="/create-pages" element={<CreatePage />} />
                <Route path="/edit-pages/:id" element={<SectionManagement />} />
                {/* <Route path="/about" element={<About />} /> */}
                {/* <Route path="/contact" element={<Contact />} /> */}
              </Routes>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </Router>
  );
}

export default AppRoutes;
