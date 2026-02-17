import React from "react";
import DashboardStats from "../../components/admin/DashboardStats";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-slate-900">
        Admin Dashboard
      </h1>
      <DashboardStats />
      
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* We can add quick link buttons here later if needed */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
             Navigate using the sidebar to manage requests, medicines, categories, and users.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
