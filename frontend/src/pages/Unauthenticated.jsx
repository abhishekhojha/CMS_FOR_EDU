import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";

const UnauthenticatedPage = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      handleLogout();
    }, [1000]);
  }, []);
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You need to be logged in to access this page.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => navigate("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthenticatedPage;
