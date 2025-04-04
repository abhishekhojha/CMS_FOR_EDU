import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Info,
  Mail,
  LogOut,
  Menu,
  X,
  User,
  ShoppingBag,
  StickyNote,
  Notebook,
  LayoutDashboard,
  Bell,
  CirclePercent,
  File,
  Contact,
  CalendarPlus,
  Speech,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/pages", icon: <StickyNote size={20} />, label: "Pages" },
    { path: "/courses", icon: <Notebook size={20} />, label: "Courses" },
    { path: "/orders", icon: <ShoppingBag size={20} />, label: "Orders" },
    { path: "/users", icon: <User size={20} />, label: "Users" },
    { path: "/files", icon: <File size={20} />, label: "Files" },
    { path: "/contacts", icon: <Contact size={20} />, label: "Contacts" },
    {
      path: "/latest-updates",
      icon: <CalendarPlus size={20} />,
      label: "Latest Updates",
    },
    {
      path: "/promo-codes",
      icon: <CirclePercent size={20} />,
      label: "Promo Codes",
    },
    {
      path: "/notifications",
      icon: <Bell size={20} />,
      label: "Notifications",
    },
    {
      path: "/announcements",
      icon: <Speech size={20} />,
      label: "Announcements",
    },
  ];

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-[32px] translate-y-[-50%] left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white pt-18 lg:pt-6 p-6 lg:min-h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Menu Items */}
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 mb-4 p-2 hover:bg-gray-700 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 mt-8 p-2 w-full hover:bg-red-600 rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Sidebar;
