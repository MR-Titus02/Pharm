import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(form);
      showToast({
        type: "success",
        message: "Account created. You are now signed in.",
      });
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
      showToast({
        type: "error",
        message: "Registration failed. Please check your details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-4 flex max-w-5xl overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/80 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
        <div className="hidden w-2/5 flex-col justify-between border-r border-slate-800/80 bg-gradient-to-b from-emerald-900/70 via-slate-950 to-sky-900/70 p-6 text-slate-100 md:flex">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/40">
                <span className="text-sm font-bold text-emerald-300">
                  Rx
                </span>
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  PharMS
                </h1>
                <p className="text-[11px] text-slate-300">
                  Pharmacy Management Suite
                </p>
              </div>
            </div>

            <p className="mb-2 text-xs font-semibold text-emerald-100">
              Create your workspace access.
            </p>
            <p className="text-[11px] text-slate-300">
              Register as an authorized user to begin managing
              medicines and prescription workflows securely.
            </p>
          </div>
          <p className="mt-6 text-[10px] text-slate-500">
            Registration should only be completed under supervision of
            your pharmacy&apos;s administrator.
          </p>
        </div>

        <div className="w-full bg-slate-950/80 px-6 py-7 text-slate-100 md:w-3/5">
          <h2 className="mb-1 text-lg font-semibold tracking-tight">
            Create an account
          </h2>
          <p className="mb-5 text-xs text-slate-400">
            Enter your details to start using PharMS.
          </p>

          {error && (
            <p className="mb-3 rounded-md border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="mb-1 block text-slate-200">
                Full name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                className="w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-slate-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-slate-200">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
