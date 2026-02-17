import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import UserMedicinesList from "./pages/medicines/UserMedicinesList";
import UserMedicineDetail from "./pages/medicines/UserMedicineDetail";
import MedicinesAdminList from "./pages/admin/MedicinesAdminList";
import MedicineForm from "./pages/admin/MedicineForm";
import UserRequestsList from "./pages/requests/UserRequestsList";
import UserRequestCreate from "./pages/requests/UserRequestCreate";
import RequestsAdminList from "./pages/admin/RequestsAdminList";

const UserDashboard = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 className="mb-2 text-lg font-semibold text-slate-900">
      Welcome to PharMS
    </h1>
    <p className="text-sm text-slate-600">
      Use the navigation to browse medicines or review your
      prescription requests.
    </p>
  </div>
);

const AdminDashboard = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 className="mb-2 text-lg font-semibold text-slate-900">
      Admin overview
    </h1>
    <p className="text-sm text-slate-600">
      Manage medicines and prescription requests from the sidebar.
      Detailed analytics will be added in a later phase.
    </p>
  </div>
);

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
        <Route path="/medicines" element={<UserMedicinesList />} />
        <Route path="/medicines/:id" element={<UserMedicineDetail />} />
        <Route path="/requests" element={<UserRequestsList />} />
        <Route path="/requests/new" element={<UserRequestCreate />} />
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
        <Route path="/admin/medicines" element={<MedicinesAdminList />} />
        <Route path="/admin/medicines/new" element={<MedicineForm />} />
        <Route path="/admin/medicines/:id/edit" element={<MedicineForm />} />
        <Route path="/admin/requests" element={<RequestsAdminList />} />
      </Route>

    </Routes>
  );
}

export default App;
