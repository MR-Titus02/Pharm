import React, { useEffect, useState } from "react";
import DashboardStats from "../../components/admin/DashboardStats";
import { fetchAdminReports } from "../../services/reportService";
import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState";

const AdminDashboard = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchAdminReports();
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  if (loading) return <LoadingState message="Loading admin dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Overview of system health and activity</p>
      </div>

      {/* Main Stats */}
      <DashboardStats />

      {/* Revenue and Activity Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">💰 Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">${reports?.payments?.totalRevenue?.toFixed(2) || "0.00"}</p>
              <p className="mt-1 text-xs text-emerald-600">{reports?.payments?.totalTransactions || 0} transactions</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">⏳ Pending Actions</p>
            <p className="mt-2 text-3xl font-bold text-amber-700">{reports?.pending?.requests || 0}</p>
            <p className="mt-1 text-xs text-amber-600">{reports?.pending?.payments || 0} awaiting payment</p>
          </div>
        </div>

        <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide">📦 Shipment Status</p>
            <p className="mt-2 text-3xl font-bold text-sky-700">{reports?.delivery?.totalShipped || 0}</p>
            <p className="mt-1 text-xs text-sky-600">in transit to customers</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">⚡ Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/requests"
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            📋 Review Requests
          </Link>
          <Link
            to="/admin/medicines"
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            💊 Manage Medicines
          </Link>
          <Link
            to="/admin/payments"
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition"
          >
            💳 View Payments
          </Link>
          <Link
            to="/admin/users"
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            👥 Manage Users
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-900">📊 Request Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-600">Pending:</span>
              <span className="font-semibold text-amber-600">{reports?.requests?.pending || 0}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-600">Approved:</span>
              <span className="font-semibold text-emerald-600">{reports?.requests?.approved || 0}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-600">Paid:</span>
              <span className="font-semibold text-sky-600">{reports?.requests?.paid || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Delivered:</span>
              <span className="font-semibold text-emerald-600">{reports?.delivery?.delivered || 0}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-900">📈 System Health</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-600">Active Users:</span>
              <span className="font-semibold text-slate-900">{reports?.users?.total || 0}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-600">Available Medicines:</span>
              <span className="font-semibold text-slate-900">{reports?.medicines?.total || 0}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-600">Low Stock Items:</span>
              <span className="font-semibold text-red-600">{reports?.medicines?.lowStock || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Success Rate:</span>
              <span className="font-semibold text-emerald-600">99.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
