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
import CategoriesAdminList from "./pages/admin/CategoriesAdminList";
import CategoryForm from "./pages/admin/CategoryForm";
import UsersAdminList from "./pages/admin/UsersAdminList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PaymentPage from "./pages/payments/PaymentPage";
import PaymentsAdminList from "./pages/admin/PaymentsAdminList";

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
        <Route path="/payment" element={<PaymentPage />} />
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
        <Route path="/admin/payments" element={<PaymentsAdminList />} />
        <Route path="/admin/categories" element={<CategoriesAdminList />} />
        <Route path="/admin/categories/new" element={<CategoryForm />} />
        <Route path="/admin/categories/:id/edit" element={<CategoryForm />} />
        <Route path="/admin/users" element={<UsersAdminList />} />
      </Route>

    </Routes>
  );
}

export default App;
