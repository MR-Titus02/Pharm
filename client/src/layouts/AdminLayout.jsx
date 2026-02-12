import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex">
      
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-xl font-bold mb-6">PharMS Admin</h1>

        <div className="flex flex-col gap-3">
          <Link to="/admin" className="hover:text-gray-300">
            Dashboard
          </Link>

          <Link to="/admin/medicines" className="hover:text-gray-300">
            Medicines
          </Link>

          <Link to="/admin/requests" className="hover:text-gray-300">
            Requests
          </Link>
        </div>
      </aside>

      <div className="flex-1 bg-gray-100">
        <nav className="bg-white shadow p-4 flex justify-between">
          <span>Welcome, {user?.name}</span>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </nav>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
