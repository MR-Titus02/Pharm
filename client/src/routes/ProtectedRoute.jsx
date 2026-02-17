import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "../components/LoadingState";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingState message="Authenticating..." />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
