import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen max-w-6xl rounded-3xl border border-slate-800/70 bg-slate-950/80 shadow-[0_22px_70px_rgba(15,23,42,0.9)]">
        <aside className="flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/80 px-5 py-6 text-slate-100">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/40">
              <span className="text-sm font-bold text-emerald-300">
                Rx
              </span>
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">
                PharMS Admin
              </h1>
              <p className="text-[11px] text-slate-400">
                Control panel
              </p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-2 text-xs font-medium">
            <Link
              to="/admin"
              className="rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800/80 hover:text-sky-300"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/medicines"
              className="rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800/80 hover:text-emerald-300"
            >
              Medicines
            </Link>
            <Link
              to="/admin/requests"
              className="rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800/80 hover:text-amber-300"
            >
              Requests
            </Link>
          </nav>

          <div className="mt-6 border-t border-slate-800/80 pt-4 text-xs">
            <p className="mb-2 text-slate-400">
              Signed in as{" "}
              <span className="font-semibold text-slate-100">
                {user?.name}
              </span>
            </p>
            <button
              onClick={logout}
              className="w-full rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-slate-800/80 bg-slate-950/60 px-6 py-3 text-xs text-slate-300">
            Manage medicines, prescriptions, and requests with
            clinical-grade oversight.
          </header>
          <main className="flex-1 px-6 py-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
