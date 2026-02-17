import React from "react";

// Generic status badge with a pharmacy-inspired color system.
// Variants are mapped to semantic Tailwind classes so we can
// reuse across medicines, requests, and stock states.

const VARIANT_STYLES = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  neutral: "bg-slate-50 text-slate-700 border-slate-200",
};

const StatusBadge = ({ label, variant = "neutral" }) => {
  const classes =
    VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;

