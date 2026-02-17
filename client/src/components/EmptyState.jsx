import React from "react";

const EmptyState = ({ title, description }) => {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
      <p className="mb-2 text-sm font-semibold text-slate-700">
        {title}
      </p>
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
};

export default EmptyState;

