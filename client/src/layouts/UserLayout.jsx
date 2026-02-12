import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="font-bold text-xl">PharMS</h1>

        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-600">{user?.name}</span>

          <div className="flex gap-4">
            <Link to="/" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/medicines" className="hover:underline">
              Medicines
            </Link>
            <Link to="/requests" className="hover:underline">
              My Requests
            </Link>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
