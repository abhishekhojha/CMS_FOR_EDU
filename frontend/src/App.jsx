import { useState } from "react";
import "./App.css";
import AppRoutes from "@/routes/AppRoutes";
import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return <AppRoutes />;
}

export default App;
