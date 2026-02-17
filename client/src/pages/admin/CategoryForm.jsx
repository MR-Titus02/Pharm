import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  updateCategory,
  fetchCategories,
} from "../../services/categoryService";
import LoadingState from "../../components/LoadingState";
import { useToast } from "../../context/ToastContext";

const CategoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // We'll fetch all and find the one to edit since we don't have a single GET
        // or we could add a single GET endpoint. For now, this is fine for small lists.
        const categories = await fetchCategories();
        const category = categories.find((c) => c._id === id);
        if (category) {
          setForm({
            name: category.name,
            description: category.description || "",
          });
        } else {
          setError("Category not found");
        }
      } catch (err) {
        setError("Failed to load category details.");
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      load();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isEdit) {
        await updateCategory(id, form);
      } else {
        await createCategory(form);
      }
      showToast({
        type: "success",
        message: isEdit
          ? "Category updated successfully."
          : "Category created successfully.",
      });
      navigate("/admin/categories");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save category."
      );
      showToast({
        type: "error",
        message: "Failed to save category.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading category..." />;
  }

  return (
    <div className="max-w-xl">
      <button
        type="button"
        onClick={() => navigate("/admin/categories")}
        className="mb-4 text-xs font-medium text-sky-700 hover:text-sky-800"
      >
        ← Back to categories
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-slate-900">
          {isEdit ? "Edit category" : "Add category"}
        </h1>
        <p className="mb-4 text-xs text-slate-500">
          Organize medicines into categories for better user navigation.
        </p>

        {error && (
          <p className="mb-3 text-xs font-medium text-rose-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full resize-none rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-md bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Create category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
