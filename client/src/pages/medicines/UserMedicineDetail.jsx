import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMedicineById, fetchMedicines } from "../../services/medicineService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import StatusBadge from "../../components/StatusBadge";

const UserMedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [related, setRelated] = useState([]);

  const loadMedicine = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchMedicineById(id);
      setMedicine(data);

      // Fetch related medicines by category
      if (data?.category) {
        const all = await fetchMedicines();
        const list = Array.isArray(all) ? all : all?.medicines || [];
        const relatedItems = list
          .filter((m) => m._id !== data._id && m.category === data.category)
          .slice(0, 4);
        setRelated(relatedItems);
      } else {
        setRelated([]);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setError("This medicine could not be found.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load medicine details."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicine();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading medicine details..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMedicine} />;
  }

  if (!medicine) {
    return (
      <ErrorState message="Medicine details are not available." />
    );
  }

  const {
    name,
    description,
    price,
    inStock,
    requiresPrescription,
    dosage,
    form,
    manufacturer,
    category,
  } = medicine;

  const stockFlag =
    typeof inStock === "boolean" ? inStock : (medicine.stock ?? 0) > 0;

  const stockVariant = stockFlag ? "success" : "danger";
  const stockLabel = stockFlag ? "In stock" : "Out of stock";

  const rxVariant = requiresPrescription ? "warning" : "info";
  const rxLabel = requiresPrescription ? "Prescription required" : "Over-the-counter";

  return (
    <div className="max-w-2xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-xs font-medium text-sky-700 hover:text-sky-800"
      >
        ← Back to medicines
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {name}
            </h1>
            {manufacturer && (
              <p className="mt-1 text-xs text-slate-500">
                {manufacturer}
              </p>
            )}
            {category && (
              <p className="mt-1 text-[11px] text-slate-500">
                Category: {category}
              </p>
            )}
          </div>
          {typeof price === "number" && (
            <p className="text-base font-semibold text-emerald-700">
              ${price.toFixed(2)}
            </p>
          )}
        </header>

        {description && (
          <p className="mb-4 text-sm text-slate-700">{description}</p>
        )}

        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <StatusBadge label={stockLabel} variant={stockVariant} />
          <StatusBadge label={rxLabel} variant={rxVariant} />
          {form && (
            <StatusBadge label={form} variant="neutral" />
          )}
        </div>

        {dosage && (
          <dl className="mt-2 grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-700">
                Dosage
              </dt>
              <dd>{dosage}</dd>
            </div>
          </dl>
        )}

        <p className="mt-6 rounded-lg bg-sky-50 p-3 text-[11px] text-sky-700">
          For safety, prescription enforcement is validated on the
          server when you create a request. Always follow your
          healthcare provider&apos;s guidance.
        </p>
      </div>

      {related.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Related medicines
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => navigate(`/medicines/${item._id}`)}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs hover:bg-slate-100"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {item.name}
                  </p>
                  {item.manufacturer && (
                    <p className="text-[11px] text-slate-500">
                      {item.manufacturer}
                    </p>
                  )}
                </div>
                {typeof item.price === "number" && (
                  <p className="text-[11px] font-semibold text-emerald-700">
                    ${item.price.toFixed(2)}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMedicineDetail;

