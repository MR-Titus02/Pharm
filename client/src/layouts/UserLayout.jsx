import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-sky-800/60 bg-slate-950/70 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/40">
              <span className="text-sm font-bold text-sky-300">Rx</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-50">
                PharMS
              </h1>
              <p className="text-[11px] text-slate-400">
                Patient portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-200">
              <Link
                to="/"
                className="hover:text-sky-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/medicines"
                className="hover:text-sky-300 transition-colors"
              >
                Medicines
              </Link>
              <Link
                to="/requests"
                className="hover:text-sky-300 transition-colors"
              >
                My Requests
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-rose-600"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.85)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
