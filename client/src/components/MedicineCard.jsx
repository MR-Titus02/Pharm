import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

// Presentational card for a medicine in the list view.
// Business rules (e.g., prescription enforcement) live on the backend;
// this component only reflects provided fields.

const MedicineCard = ({ medicine }) => {
  const {
    _id,
    name,
    description,
    price,
    stock,
    requiresPrescription,
    image,
  } = medicine;

  const inStock = (stock ?? 0) > 0;

  const stockVariant = inStock ? "success" : "danger";
  const stockLabel = inStock ? "In stock" : "Out of stock";

  const rxVariant = requiresPrescription ? "warning" : "info";
  const rxLabel = requiresPrescription ? "Rx required" : "OTC";

  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div>
        {image && (
          <div className="mb-3 h-28 w-full overflow-hidden rounded-md">
            <img
              src={(import.meta.env.VITE_API_URL || "http://localhost:5001").replace('/api','') + image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            {name}
          </h3>
          {typeof price === "number" && (
            <p className="text-sm font-semibold text-emerald-700">
              ${price.toFixed(2)}
            </p>
          )}
        </div>

        {description && (
          <p className="mb-3 line-clamp-2 text-xs text-slate-600">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-[11px]">
          <StatusBadge label={stockLabel} variant={stockVariant} />
          <StatusBadge label={rxLabel} variant={rxVariant} />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/medicines/${_id}`}
          className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          View details
        </Link>
      </div>
    </article>
  );
};

export default MedicineCard;

