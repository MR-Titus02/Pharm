import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMedicine,
  updateMedicine,
  fetchMedicineById,
  fetchMedicines,
} from "../../services/medicineService";
import { fetchCategories, createCategory } from "../../services/categoryService";
import LoadingState from "../../components/LoadingState";
import { useToast } from "../../context/ToastContext";

const initialState = {
  name: "",
  description: "",
  price: "",
  inStock: true,
  stock: 0,
  requiresPrescription: false,
  dosage: "",
  form: "",
  manufacturer: "",
  category: "",
};

const MedicineForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState("");
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
          stock: data.stock ?? 0,
          requiresPrescription: Boolean(data.requiresPrescription),
          dosage: data.dosage || "",
          form: data.form || "",
          manufacturer: data.manufacturer || "",
          category: data.category || "",
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        let cats = Array.isArray(data) ? data : [];

        // Also include categories from existing medicines
        try {
          const meds = await fetchMedicines(1, 1000);
          const medList = meds?.medicines || [];
          const medCats = Array.from(new Set(medList.map((m) => m.category).filter(Boolean)));
          // Add categories found in medicines that aren't in the main categories list
          medCats.forEach((name) => {
            if (!cats.find((c) => c.name === name)) {
              cats.push({ _id: `med-${name}`, name, description: "(from medicines)" });
            }
          });
        } catch (mErr) {
          // ignore medicine load errors
          console.log(mErr)
        }

        setCategories(cats);
        if (!isEdit && cats.length > 0) {
          setForm((f) => ({ ...f, category: cats[0].name }));
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      // Sync inStock checkbox with numeric stock quantity for clarity
      if (name === "inStock") {
        const newInStock = Boolean(checked);
        return {
          ...prev,
          inStock: newInStock,
          stock: newInStock ? (prev.stock > 0 ? prev.stock : 1) : 0,
        };
      }

      if (name === "stock") {
        const n = Number(value);
        return {
          ...prev,
          stock: Number.isNaN(n) ? 0 : n,
          inStock: n > 0,
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Auto-create category if it doesn't exist
      if (form.category && !categories.find((c) => c.name === form.category)) {
        try {
          const newCat = await createCategory({ name: form.category });
          setCategories((prev) => [...prev, newCat]);
        } catch (catErr) {
          // ignore category create errors but continue
          console.warn("Failed to auto-create category", catErr?.message);
        }
      }
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
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Enter medicine name"
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
              className="w-full resize-none rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Describe the medicine"
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
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Form
              </label>
              <select
                name="form"
                value={form.form}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Select form</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Liquid">Liquid</option>
                <option value="Injection">Injection</option>
                <option value="Ointment">Ointment</option>
                <option value="Cream">Cream</option>
                <option value="Gel">Gel</option>
                <option value="Powder">Powder</option>
                <option value="Patch">Patch</option>
                <option value="Drops">Drops</option>
                <option value="Inhaler">Inhaler</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700">Stock quantity</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
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
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
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
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g. Branded Pharma Ltd"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700">Image</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setSelectedImageName(file.name || "");
                  setUploadingImage(true);
                  try {
                    const fd = new FormData();
                    fd.append("image", file);
                    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/upload/image`, {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                      },
                      body: fd,
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || "Upload failed");
                    setForm((f) => ({ ...f, image: `/uploads/${data.file.filename}` }));
                    showToast({ type: "success", message: "Image uploaded." });
                  } catch (err) {
                    showToast({ type: "error", message: err.message || "Image upload failed" });
                  } finally {
                    setUploadingImage(false);
                  }
                }}
                className="text-xs bg-white text-slate-900"
              />

              <div className="text-xs text-slate-700">
                {uploadingImage ? "Uploading..." : (selectedImageName || "No file selected")}
              </div>

              {form.image && (
                <img
                  src={(import.meta.env.VITE_API_URL || "http://localhost:5001").replace('/api','') + form.image}
                  alt="Preview"
                  className="h-10 w-10 rounded-md object-cover"
                />
              )}
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

