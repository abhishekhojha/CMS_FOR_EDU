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
import Courses from "@/pages/Courses";
import CreateCourseForm from "@/pages/CreateCourseForm";
import CourseList from "@/pages/Courses";
import OrdersList from "@/pages/Orders";
import UpdateCourses from "@/pages/UpdateCourses";
import Users from "@/pages/Users";
import UnauthenticatedPage from "@/pages/Unauthenticated";
function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <ProtectedRoute>
          <div className="flex">
            {isAuthenticated && <Sidebar />}
            <div className="w-full lg:flex-1">
              {isAuthenticated && <TopBar />}
              <div className={`pt-[85px] md:pt-16 p-3 md:p-6 lg:max-h-screen lg:overflow-y-auto`}>
                <Routes>
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/pages" element={<PagesList />} />
                  <Route path="/orders" element={<OrdersList />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/create-pages" element={<CreatePage />} />
                  <Route
                    path="/create-courses"
                    element={<CreateCourseForm />}
                  />

                  <Route
                    path="/edit-pages/:id/:name"
                    element={<SectionManagement />}
                  />
                  <Route path="/edit-course/:id" element={<UpdateCourses />} />

                  {/* <Route path="/about" element={<About />} /> */}
                  {/* <Route path="/contact" element={<Contact />} /> */}
                </Routes>
              </div>
            </div>
          </div>
        </ProtectedRoute>
        <Routes>
          {/* <Route exact path="/" element={<Welcome />} /> */}

          {/* Public Routes */}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/restricted" element={<UnauthenticatedPage />} />
          
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default AppRoutes;
