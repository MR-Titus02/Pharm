import React from "react";

const UserDashboard = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-lg font-semibold text-slate-900">
        Welcome to PharMS
      </h1>
      <p className="text-sm text-slate-600">
        Use the navigation to browse medicines or review your prescription
        requests.
      </p>
    </div>
  );
};

export default UserDashboard;
