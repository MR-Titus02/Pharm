import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMedicineById } from "../../services/medicineService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

const UserMedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMedicine = async () => {
      try {
        setLoading(true);
        const data = await fetchMedicineById(id);
        setMedicine(data);
      } catch (err) {
        setError("Failed to load medicine details.");
      } finally {
        setLoading(false);
      }
    };
    loadMedicine();
  }, [id]);

  if (loading) return <LoadingState message="Loading details..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!medicine) return <ErrorState message="Medicine not found" />;

  const handleRequest = () => {
    // Navigate to request creation with pre-filled medicine ID
    navigate("/requests/new", { state: { medicineId: medicine._id, medicineName: medicine.name } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/medicines")}
        className="mb-4 text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
      >
        ← Back to medicines
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm grid md:grid-cols-2">
        <div className="bg-slate-100 flex items-center justify-center p-8 min-h-[300px]">
          {medicine.image ? (
            <img
              src={(import.meta.env.VITE_API_URL || "http://localhost:5001").replace('/api','') + medicine.image}
              alt={medicine.name}
              className="max-h-[420px] max-w-full object-contain"
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-3xl">
                💊
              </div>
              <p className="mt-4 text-sm text-slate-400 font-medium">No image available</p>
            </div>
          )}
        </div>

        <div className="p-8 flex flex-col">
          <div className="mb-auto">
            <div className="flex items-start justify-between gap-4">
               <div>
                  <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 mb-2">
                    {medicine.category || "General"}
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900">{medicine.name}</h1>
                  <p className="text-sm text-slate-500 mt-1">{medicine.manufacturer}</p>
               </div>
               <div className="text-right">
                 <p className="text-xl font-bold text-sky-600">${medicine.price?.toFixed(2)}</p>
               </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</h3>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  {medicine.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dosage</h3>
                   <p className="mt-1 text-sm text-slate-900">{medicine.dosage || "N/A"}</p>
                </div>
                <div>
                   <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Form</h3>
                   <p className="mt-1 text-sm text-slate-900">{medicine.form || "Tablet"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                 <StatusBadge 
                    label={medicine.stock > 0 ? "In Stock" : "Out of Stock"} 
                    variant={medicine.stock > 0 ? "success" : "error"} 
                 />
                 {medicine.prescriptionRequired && (
                    <StatusBadge label="Prescription Required" variant="warning" />
                 )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
             <button
               onClick={handleRequest}
               disabled={!medicine.stock}
               className="w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               {medicine.stock > 0 ? "Request Medicine" : "Out of Stock"}
             </button>
             {medicine.prescriptionRequired && (
                <p className="mt-3 text-xs text-center text-amber-600">
                  ⚠️ You will need to upload a prescription for this item.
                </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMedicineDetail;
