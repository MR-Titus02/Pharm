import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

const UserDashboard = () => <div>User Dashboard</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<UserDashboard />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

    </Routes>
  );
}

export default App;
