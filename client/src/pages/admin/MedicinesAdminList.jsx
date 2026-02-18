import React, { useEffect, useState } from "react";
import {
  fetchMedicines,
  deleteMedicine,
} from "../../services/medicineService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const MedicinesAdminList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadMedicines = async (page = 1) => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchMedicines(page, 10);
      setMedicines(Array.isArray(data) ? data : data?.medicines || []);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load medicines.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines(1);
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Delete medicine "${name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteMedicine(id);
      setMedicines((prev) => prev.filter((m) => m._id !== id));
      showToast({
        type: "success",
        message: `Medicine "${name}" deleted.`,
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete medicine.";
      setError(message);
      showToast({
        type: "error",
        message: "Failed to delete medicine.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadMedicines(newPage);
    }
  };

  if (loading) {
    return <LoadingState message="Loading medicines for management..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => loadMedicines(1)} />;
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Manage medicines
          </h1>
          <p className="text-xs text-slate-400">
            Add, edit, or remove medicines available in your pharmacy.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/medicines/new")}
          className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + Add medicine
        </button>
      </header>

      {medicines.length === 0 ? (
        <EmptyState
          title="No medicines configured"
          description="Start by adding your first medicine to make it available to users."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">
                    Stock
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-700">
                    Prescription
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-700">
                    Price
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map((medicine) => {
                  // Check for stock status - handle both 'inStock' and 'stock' fields
                  const hasStock = medicine.inStock !== false && 
                                   (medicine.stock === undefined || medicine.stock > 0);
                  const stockVariant = hasStock ? "success" : "danger";
                  const rxVariant = medicine.requiresPrescription === true
                    ? "warning"
                    : "info";
                  return (
                    <tr key={medicine._id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-2 text-slate-800">
                        {medicine.name}
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge
                          label={hasStock ? "In stock" : "Out of stock"}
                          variant={stockVariant}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge
                          label={
                            medicine.requiresPrescription
                              ? "Rx required"
                              : "OTC"
                          }
                          variant={rxVariant}
                        />
                      </td>
                      <td className="px-4 py-2 text-right text-slate-800">
                        {typeof medicine.price === "number"
                          ? `$${medicine.price.toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/medicines/${medicine._id}/edit`}
                            className="text-xs font-medium text-sky-700 hover:text-sky-800"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(medicine._id, medicine.name)
                            }
                            disabled={deletingId === medicine._id}
                            className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-60"
                          >
                            {deletingId === medicine._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="text-xs text-slate-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} medicines
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 enabled:hover:text-slate-900"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
                          page === pagination.page
                            ? "bg-sky-600 text-white"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 enabled:hover:text-slate-900"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MedicinesAdminList;

