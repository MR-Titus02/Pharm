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
  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadMedicines = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchMedicines();
      setMedicines(Array.isArray(data) ? data : data?.medicines || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load medicines.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
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

  if (loading) {
    return <LoadingState message="Loading medicines for management..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMedicines} />;
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Manage medicines
          </h1>
          <p className="text-xs text-slate-500">
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
                const stockVariant = medicine.inStock
                  ? "success"
                  : "danger";
                const rxVariant = medicine.requiresPrescription
                  ? "warning"
                  : "info";
                return (
                  <tr key={medicine._id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-2 text-slate-800">
                      {medicine.name}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge
                        label={medicine.inStock ? "In stock" : "Out of stock"}
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
      )}
    </div>
  );
};

export default MedicinesAdminList;

