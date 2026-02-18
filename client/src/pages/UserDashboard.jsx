import React, { useEffect, useState } from "react";
import { fetchUserStats } from "../services/reportService";
import LoadingState from "../components/LoadingState";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, subtext, colorClass, icon }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
          {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
        </div>
      </div>
      {icon && <div className="text-3xl">{icon}</div>}
    </div>
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchUserStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <LoadingState message="Loading your dashboard..." />;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {user?.name}!
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your prescriptions, track deliveries, and view payment history.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={stats?.requests?.total || 0}
          subtext={`${stats?.requests?.approved || 0} approved`}
          colorClass="text-slate-700"
          icon="📋"
        />
        <StatCard
          title="Total Spent"
          value={`$${stats?.payments?.totalSpent?.toFixed(2) || "0.00"}`}
          subtext={`${stats?.payments?.totalPaid || 0} paid`}
          colorClass="text-emerald-600"
          icon="💳"
        />
        <StatCard
          title="In Delivery"
          value={stats?.delivery?.shipped || 0}
          subtext={`${stats?.delivery?.delivered || 0} delivered`}
          colorClass="text-amber-500"
          icon="📦"
        />
        <StatCard
          title="Pending Review"
          value={stats?.requests?.pending || 0}
          subtext={`${stats?.requests?.rejected || 0} rejected`}
          colorClass="text-sky-600"
          icon="⏳"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/medicines"
            className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 hover:bg-sky-100 transition"
          >
            🏥 Browse Medicines
          </Link>
          <Link
            to="/requests"
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 hover:bg-amber-100 transition"
          >
            📝 My Requests
          </Link>
          <Link
            to="/requests/create"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition"
          >
            ➕ New Request
          </Link>
        </div>
      </div>

      {/* Summary Info */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">📄 Request Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Pending Approval:</span>
              <span className="font-semibold text-slate-900">{stats?.requests?.pending || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Approved:</span>
              <span className="font-semibold text-emerald-600">{stats?.requests?.approved || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Rejected:</span>
              <span className="font-semibold text-red-600">{stats?.requests?.rejected || 0}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">💰 Payment Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Paid Requests:</span>
              <span className="font-semibold text-slate-900">{stats?.payments?.totalPaid || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Average Order:</span>
              <span className="font-semibold text-emerald-600">${((stats?.payments?.totalSpent || 0) / Math.max(stats?.payments?.totalPaid || 1, 1)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Pending Payment:</span>
              <span className="font-semibold text-amber-600">${stats?.payments?.pending?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
