import React, { useEffect, useState } from "react";
import {
  getAllRequests,
  updateRequestStatus,
} from "../../services/requestService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../context/ToastContext";

const getStatusVariant = (status) => {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "warning";
};

const RequestsAdminList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const { showToast } = useToast();

  const loadRequests = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await getAllRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load requests. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateRequestStatus(id, status);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
      showToast({
        type: "success",
        message: `Request ${status}.`,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update request status. Please try again."
      );
      showToast({
        type: "error",
        message: "Failed to update request status.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  if (loading) {
    return <LoadingState message="Loading all requests..." />;
  }

  if (error && !requests.length) {
    return <ErrorState message={error} onRetry={loadRequests} />;
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            All requests
          </h1>
          <p className="text-xs text-slate-400">
            Review and approve or reject prescription requests.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="text-slate-300">
            Status:
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="ml-2 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>
      </header>

      {!requests.length ? (
        <EmptyState
          title="No requests yet"
          description="You will see prescription requests here as patients submit them."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="min-w-full divide-y divide-slate-800 text-xs">
            <thead className="bg-slate-900/70">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">
                  Patient
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">
                  Medicine
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-300">
                  Prescription
                </th>
                <th className="px-4 py-2 text-right font-semibold text-slate-300">
                  Created
                </th>
                <th className="px-4 py-2 text-right font-semibold text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRequests.map((request) => {
                const createdAt = request.createdAt
                  ? new Date(request.createdAt)
                  : null;
                const hasPrescription = Boolean(request.prescriptionFile);

                return (
                  <tr
                    key={request._id}
                    className="hover:bg-slate-900/70"
                  >
                    <td className="px-4 py-2 text-slate-100">
                      {request.userId?.name || "Unknown"}{" "}
                      <span className="block text-[11px] text-slate-400">
                        {request.userId?.email}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-100">
                      {request.medicineId?.name || "Unknown medicine"}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge
                        label={
                          request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)
                        }
                        variant={getStatusVariant(request.status)}
                      />
                    </td>
                    <td className="px-4 py-2 text-[11px] text-slate-300">
                      {hasPrescription ? (
                        <a
                          href={request.prescriptionFile}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-300 hover:text-sky-200"
                        >
                          View file
                        </a>
                      ) : (
                        "Not attached"
                      )}
                    </td>
                    <td className="px-4 py-2 text-right text-[11px] text-slate-400">
                      {createdAt
                        ? createdAt.toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {request.status === "pending" ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateStatus(
                                request._id,
                                "approved"
                              )
                            }
                            disabled={updatingId === request._id}
                            className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {updatingId === request._id
                              ? "Updating..."
                              : "Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateStatus(
                                request._id,
                                "rejected"
                              )
                            }
                            disabled={updatingId === request._id}
                            className="rounded-full bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          No actions
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {error && requests.length > 0 && (
        <p className="text-[11px] text-rose-300">{error}</p>
      )}
    </div>
  );
};

export default RequestsAdminList;

