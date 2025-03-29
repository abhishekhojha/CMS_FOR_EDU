// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "@/pages/HomePage";
// import PagesList from "@/pages/PagesList";
// // import Contact from '@/pages/Contact';
// import ProtectedRoute from "@/middleware/ProtectedRoute";
// import { Button } from "@/components/ui/button";
// import Sidebar from "@/components/ui/Sidebar";
// import { useSelector } from "react-redux";
// import TopBar from "@/components/ui/TopBar";
// import CreatePage from "@/pages/CreatePage";
// import Login from "@/pages/Login";
// import Signup from "@/pages/Signup";
// import Welcome from "@/pages/Welcome";
// import SectionManagement from "@/pages/PageSections";
// import Courses from "@/pages/Courses";
// import CreateCourseForm from "@/pages/CreateCourseForm";
// import CourseList from "@/pages/Courses";
// import OrdersList from "@/pages/Orders";
// import UpdateCourses from "@/pages/UpdateCourses";
// import Users from "@/pages/Users";
// import UnauthenticatedPage from "@/pages/Unauthenticated";
// function AppRoutes() {
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   return (
//     <>
//       <Router>
//         <ProtectedRoute>
//           <div className="flex">
//             {isAuthenticated && <Sidebar />}
//             <div className="w-full lg:flex-1">
//               {isAuthenticated && <TopBar />}
//               <div
//                 className={`pt-[85px] md:pt-16 p-3 md:p-6 lg:max-h-screen lg:overflow-y-auto`}
//               >
//                 <Routes>
//                   <Route path="/dashboard" element={<Home />} />
//                   <Route path="/pages" element={<PagesList />} />
//                   <Route path="/orders" element={<OrdersList />} />
//                   <Route path="/users" element={<Users />} />
//                   <Route path="/courses" element={<CourseList />} />
//                   <Route path="/create-pages" element={<CreatePage />} />
//                   <Route
//                     path="/create-courses"
//                     element={<CreateCourseForm />}
//                   />

//                   <Route
//                     path="/edit-pages/:id/:name"
//                     element={<SectionManagement />}
//                   />
//                   <Route path="/edit-course/:id" element={<UpdateCourses />} />
//                 </Routes>
//               </div>
//             </div>
//           </div>
//         </ProtectedRoute>
//         <Routes>
//           {/* <Route exact path="/" element={<Welcome />} /> */}

//           {/* Public Routes */}
//           <Route exact path="/login" element={<Login />} />
//           <Route exact path="/signup" element={<Signup />} />
//           <Route exact path="/restricted" element={<UnauthenticatedPage />} />

//           {/* <Route path="*" element={<NotFound />} /> */}
//         </Routes>
//       </Router>
//     </>
//   );
// }

// export default AppRoutes;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/HomePage";
import PagesList from "@/pages/PagesList";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import Sidebar from "@/components/ui/Sidebar";
import { useSelector } from "react-redux";
import TopBar from "@/components/ui/TopBar";
import CreatePage from "@/pages/CreatePage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SectionManagement from "@/pages/PageSections";
import CourseList from "@/pages/Courses";
import CreateCourseForm from "@/pages/CreateCourseForm";
import OrdersList from "@/pages/Orders";
import UpdateCourses from "@/pages/UpdateCourses";
import Users from "@/pages/Users";
import UnauthenticatedPage from "@/pages/Unauthenticated";
import PromoCodeList from "@/pages/PromoCodeList"
function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restricted" element={<UnauthenticatedPage />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages"
          element={
            <ProtectedRoute>
              <PagesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promo-codes"
          element={
            <ProtectedRoute>
              <PromoCodeList />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-pages"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-courses"
          element={
            <ProtectedRoute>
              <CreateCourseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-pages/:id/:name"
          element={
            <ProtectedRoute>
              <SectionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <ProtectedRoute>
              <UpdateCourses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
