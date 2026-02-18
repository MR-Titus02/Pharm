import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCategories,
  deleteCategory,
} from "../../services/categoryService";
import { fetchMedicines } from "../../services/medicineService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../context/ToastContext";

const CategoriesAdminList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadCategories = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchCategories();
      let cats = Array.isArray(data) ? data : [];

      // Also include any categories found on existing medicines so admin can see them
      try {
        const meds = await fetchMedicines(1, 1000);
        const medList = meds?.medicines || [];
        const medCats = Array.from(new Set(medList.map((m) => m.category).filter(Boolean)));
        // Add med-only categories that aren't in the main categories list
        medCats.forEach((name) => {
          if (!cats.find((c) => c.name === name)) {
            cats.push({ _id: `med-${name}`, name, description: "(from medicines)" });
          }
        });
      } catch (mErr) {
        // ignore medicine load errors
      }

      setCategories(cats);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      setDeletingId(id);
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      showToast({ type: "success", message: "Category deleted." });
    } catch (err) {
      showToast({ type: "error", message: "Failed to delete category." });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingState message="Loading categories..." />;
  if (error) return <ErrorState message={error} onRetry={loadCategories} />;

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Manage Categories
          </h1>
          <p className="text-xs text-slate-400">
            Define categories to organize medicines.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/categories/new")}
          className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + Add category
        </button>
      </header>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Create your first category to get started."
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
                  Description
                </th>
                <th className="px-4 py-2 text-right font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2 text-slate-800 font-medium">
                    {cat.name}
                  </td>
                  <td className="px-4 py-2 text-slate-500">
                    {cat.description || "-"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/admin/categories/${cat._id}/edit`}
                        className="text-sky-700 hover:text-sky-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        disabled={deletingId === cat._id}
                        className="text-rose-600 hover:text-rose-700 disabled:opacity-50"
                      >
                        {deletingId === cat._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoriesAdminList;
