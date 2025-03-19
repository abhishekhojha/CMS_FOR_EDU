import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { logout } from '@/redux/authSlice';

function TopBar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gray-800 text-white flex items-center justify-between pl-16 px-6 shadow-md z-30 lg:ml-64">
      <h1 className="text-xl font-bold">My App</h1>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="hidden lg:inline-block">Welcome, {user?.name}!</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;
