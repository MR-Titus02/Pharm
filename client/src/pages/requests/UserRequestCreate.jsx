import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchMedicines } from "../../services/medicineService";
import { createRequest } from "../../services/requestService";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useToast } from "../../context/ToastContext";

const UserRequestCreate = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [file, setFile] = useState(null);
  const [selectedPrescriptionName, setSelectedPrescriptionName] = useState("");
  const [viewingNicFile, setViewingNicFile] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation();

  // Initialize with navigation state if available
  useEffect(() => {
    if (state?.medicineId) {
      setSelectedMedicineId(state.medicineId);
    }
  }, [state]);

  const isImageFile = (filePath) => {
    if (!filePath) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (filePath) => {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith('.pdf');
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http")) return filePath;
    const apiUrl = axiosInstance.defaults.baseURL || "http://localhost:5001/api";
    const baseUrl = apiUrl.replace("/api", "");
    return `${baseUrl}${filePath}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await fetchMedicines();
        setMedicines(Array.isArray(data) ? data : data?.medicines || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load medicines. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedMedicine = medicines.find(
    (m) => m._id === selectedMedicineId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedMedicineId) {
      setError("Please choose a medicine to request.");
      return;
    }

    if (selectedMedicine?.prescriptionRequired && !file) {
      setError("A prescription file is required for this medicine.");
      return;
    }

    if (!user?.nicFile) {
      setError("Your NIC document is required. Please complete your profile with a valid NIC document.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("medicineId", selectedMedicineId);
      if (file) {
        formData.append("prescription", file);
      }
      // Include user's registered NIC file path for admin verification
      formData.append("nicFile", user.nicFile);

      await createRequest(formData);
      showToast({
        type: "success",
        message: "Request submitted successfully.",
      });
      navigate("/requests");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create request."
      );
      showToast({
        type: "error",
        message: "Failed to create request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Preparing request form..." />;
  }

  if (error && !medicines.length) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="max-w-xl">
      <button
        type="button"
        onClick={() => navigate("/requests")}
        className="mb-4 text-xs font-medium text-sky-300 hover:text-sky-200"
      >
        ← Back to my requests
      </button>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
        <h1 className="mb-1 text-lg font-semibold text-slate-50">
          New prescription request
        </h1>
        <p className="mb-4 text-xs text-slate-400">
          Choose a medicine and upload a prescription file when
          required. Prescription rules are enforced on the server.
        </p>

        {error && (
          <p className="mb-3 rounded-md border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="mb-1 block text-slate-200">
              Medicine
            </label>
            <select
              value={selectedMedicineId}
              onChange={(e) => setSelectedMedicineId(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Select a medicine</option>
              {medicines.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}{" "}
                  {m.prescriptionRequired ? "(Rx required)" : "(OTC)"}
                </option>
              ))}
            </select>
          </div>



          {selectedMedicine && (
            <div className="rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-3 text-[11px] text-slate-200">
              <p className="font-semibold">{selectedMedicine.name}</p>
              {selectedMedicine.prescriptionRequired ? (
                <p className="mt-1 text-amber-200">
                  This medicine requires a valid prescription. Upload a
                  clear photo or PDF of the prescription below.
                </p>
              ) : (
                <p className="mt-1 text-emerald-200">
                  This medicine can be requested without a prescription.
                </p>
              )}
            </div>
          )}

          {selectedMedicine?.prescriptionRequired && (
            <div>
              <label className="mb-1 block text-slate-200">
                Your NIC Document (Registered) <span className="text-emerald-400">✓</span>
              </label>
              {user?.nicFile ? (
                <div className="rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2">
                  <p className="text-xs text-slate-300">
                    Your NIC document from registration will be verified by the admin.
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewingNicFile(user.nicFile)}
                    className="mt-2 inline-block text-xs text-sky-400 hover:text-sky-300 font-medium"
                  >
                    View your NIC document →
                  </button>
                </div>
              ) : (
                <div className="rounded-md border border-rose-500/40 bg-rose-950/40 px-3 py-2">
                  <p className="text-xs text-rose-200">
                    Please complete your profile with a NIC document first.
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="mb-1 block text-slate-200">
              Prescription file (image or PDF)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                setSelectedPrescriptionName(f?.name || "");
              }}
              className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-sky-700"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              {selectedPrescriptionName || "No file selected"}
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit request"}
          </button>
        </form>
      </div>

      {viewingNicFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-h-[90vh] max-w-2xl w-full rounded-lg border border-slate-700 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-100">Your NIC Document</h2>
              <button
                onClick={() => setViewingNicFile(null)}
                className="text-slate-400 hover:text-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
              {isImageFile(viewingNicFile) ? (
                <div className="flex items-center justify-center bg-slate-900 p-8">
                  <img
                    src={getFileUrl(viewingNicFile)}
                    alt="NIC Document"
                    className="max-w-full h-auto"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.parentElement.innerHTML = '<div class="text-center text-slate-400"><p>Failed to load image. Please try again.</p></div>';
                    }}
                  />
                </div>
              ) : isPdfFile(viewingNicFile) ? (
                <iframe
                  src={getFileUrl(viewingNicFile)}
                  title="NIC Document PDF"
                  className="w-full h-full"
                  style={{ minHeight: '600px' }}
                  onError={(e) => {
                    console.error("PDF load error:", e);
                  }}
                />
              ) : (
                <div className="flex items-center justify-center p-8 text-slate-400">
                  <div className="text-center">
                    <p className="mb-2">Unable to preview this file type</p>
                    <a
                      href={getFileUrl(viewingNicFile)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:text-sky-300 underline"
                    >
                      Open in new window
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRequestCreate;

