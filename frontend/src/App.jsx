import { useState } from "react";
import "./App.css";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AppRoutes from "@/routes/AppRoutes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
        {/* Protected Routes */}
        {isAuthenticated ? (
          <AppRoutes />
        ) : (
          <Routes>
            <Route path="/*" element={<Login />} />
          </Routes>
        )}
      </Router>
    </>
  );
}

export default App;
