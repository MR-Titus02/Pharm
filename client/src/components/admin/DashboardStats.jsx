import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/reportService";
import LoadingState from "../LoadingState";

const StatCard = ({ title, value, subtext, colorClass }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {title}
    </p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
      {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
    </div>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard stats..." />;
  if (!stats) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats.users?.total || 0}
        colorClass="text-slate-700"
      />
      <StatCard
        title="Medicines"
        value={stats.medicines?.total || 0}
        subtext={`${stats.medicines?.lowStock || 0} low stock`}
        colorClass="text-sky-600"
      />
      <StatCard
        title="Pending Requests"
        value={stats.requests?.pending || 0}
        colorClass="text-amber-500"
      />
      <StatCard
        title="Total Requests"
        value={stats.requests?.total || 0}
        subtext={`${stats.requests?.approved || 0} approved`}
        colorClass="text-emerald-600"
      />
    </div>
  );
};

export default DashboardStats;
