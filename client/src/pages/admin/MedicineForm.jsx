import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMedicine,
  updateMedicine,
  fetchMedicineById,
} from "../../services/medicineService";
import LoadingState from "../../components/LoadingState";
import { useToast } from "../../context/ToastContext";

const initialState = {
  name: "",
  description: "",
  price: "",
  inStock: true,
  requiresPrescription: false,
  dosage: "",
  form: "",
  manufacturer: "",
};

const MedicineForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMedicineById(id);
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? "",
          inStock: Boolean(data.inStock),
          requiresPrescription: Boolean(data.requiresPrescription),
          dosage: data.dosage || "",
          form: data.form || "",
          manufacturer: data.manufacturer || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load medicine details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      load();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        price:
          form.price === "" ? undefined : Number.parseFloat(form.price),
      };

      if (isEdit) {
        await updateMedicine(id, payload);
      } else {
        await createMedicine(payload);
      }

      showToast({
        type: "success",
        message: isEdit
          ? "Medicine updated successfully."
          : "Medicine created successfully.",
      });
      navigate("/admin/medicines");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save medicine."
      );
      showToast({
        type: "error",
        message: "Failed to save medicine.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading medicine details..." />;
  }

  return (
    <div className="max-w-xl">
      <button
        type="button"
        onClick={() => navigate("/admin/medicines")}
        className="mb-4 text-xs font-medium text-sky-700 hover:text-sky-800"
      >
        ← Back to medicines
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-slate-900">
          {isEdit ? "Edit medicine" : "Add medicine"}
        </h1>
        <p className="mb-4 text-xs text-slate-500">
          Configure how this medicine appears to users. Prescription
          enforcement is still validated on the server.
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
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Price (USD)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Form
              </label>
              <input
                name="form"
                value={form.form}
                onChange={handleChange}
                placeholder="Tablet, Syrup, Injection..."
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Dosage
              </label>
              <input
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                placeholder="e.g. 500mg"
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Manufacturer
              </label>
              <input
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <label className="inline-flex items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                name="inStock"
                checked={form.inStock}
                onChange={handleChange}
                className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>In stock</span>
            </label>

            <label className="inline-flex items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                name="requiresPrescription"
                checked={form.requiresPrescription}
                onChange={handleChange}
                className="h-3.5 w-3.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Prescription required</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-md bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
            >
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save changes"
                : "Create medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineForm;

