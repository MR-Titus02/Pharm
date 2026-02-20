import React, { useEffect, useState } from "react";
import {
  getAllRequests,
  updateRequestStatus,
  updateDeliveryStatus,
} from "../../services/requestService";
import axiosInstance from "../../utils/axiosInstance";
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

const getDeliveryVariant = (status) => {
  if (status === "delivered") return "success";
  if (status === "shipped") return "info";
  if (status === "cancelled") return "danger";
  return "warning";
};

const RequestsAdminList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingDeliveryId, setUpdatingDeliveryId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [viewingFile, setViewingFile] = useState(null);
  const [viewingFileType, setViewingFileType] = useState(null); // 'nic' or 'prescription'
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const { showToast } = useToast();

  const isImageFile = (filePath) => {
    if (!filePath) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (filePath) => {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith('.pdf');
  };

  const handleViewFile = (filePath, type = 'prescription') => {
    setViewingFile(filePath);
    setViewingFileType(type);
  };

  const closeModal = () => {
    setViewingFile(null);
    setViewingFileType(null);
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    // If it's already a full URL, return as-is
    if (filePath.startsWith("http")) return filePath;
    
    // Extract base server URL from API URL (remove /api)
    const apiUrl = axiosInstance.defaults.baseURL || "http://localhost:5001/api";
    const baseUrl = apiUrl.replace("/api", "");
    
    // Construct full file URL
    return `${baseUrl}${filePath}`;
  };

  const loadRequests = async (page = 1, status = "all") => {
    try {
      setError("");
      setLoading(true);
      const data = await getAllRequests(page, 10, status === "all" ? null : status);
      setRequests(Array.isArray(data) ? data : data?.requests || []);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
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
    loadRequests(1, filter);
  }, [filter]);

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

  const handleUpdateDeliveryStatus = async (id, deliveryStatus) => {
    try {
      setUpdatingDeliveryId(id);
      await updateDeliveryStatus(id, deliveryStatus);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, deliveryStatus } : r))
      );
      showToast({
        type: "success",
        message: `Delivery status updated to ${deliveryStatus}.`,
      });
    } catch (err) {
      showToast({
        type: "error",
        message: "Failed to update delivery status.",
      });
    } finally {
      setUpdatingDeliveryId(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadRequests(newPage, filter);
    }
  };

  if (loading) {
    return <LoadingState message="Loading all requests..." />;
  }

  if (error && !requests.length) {
    return <ErrorState message={error} onRetry={() => loadRequests(1, filter)} />;
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            All requests
          </h1>
          <p className="text-xs text-slate-400">
            Review and approve or reject prescription requests. Manage delivery status for approved and paid requests.
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
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
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
                    Delivery
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300">
                    Prescription
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300">
                    NIC Document
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
                {requests.map((request) => {
                  const createdAt = request.createdAt
                    ? new Date(request.createdAt)
                    : null;
                  const hasPrescription = Boolean(request.prescriptionFile);
                  const canManageDelivery = request.status === "approved" && request.paymentStatus === "paid";

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
                      <td className="px-4 py-2">
                        {canManageDelivery ? (
                          <select
                            value={request.deliveryStatus || "pending"}
                            onChange={(e) =>
                              handleUpdateDeliveryStatus(request._id, e.target.value)
                            }
                            disabled={updatingDeliveryId === request._id}
                            className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-60"
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <StatusBadge
                            label={
                              (request.deliveryStatus || "pending").charAt(0).toUpperCase() +
                              (request.deliveryStatus || "pending").slice(1)
                            }
                            variant={getDeliveryVariant(request.deliveryStatus || "pending")}
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 text-[11px] text-slate-300">
                        {hasPrescription ? (
                          <button
                            type="button"
                            onClick={() => handleViewFile(request.prescriptionFile, 'prescription')}
                            className="text-sky-300 hover:text-sky-200 font-medium"
                          >
                            View file
                          </button>
                        ) : (
                          "Not attached"
                        )}
                      </td>
                      <td className="px-4 py-2 text-[11px] text-slate-300">
                        {request.nicFile ? (
                          <button
                            type="button"
                            onClick={() => handleViewFile(request.nicFile, 'nic')}
                            className="text-emerald-300 hover:text-emerald-200 font-medium"
                          >
                            View NIC
                          </button>
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

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <div className="text-xs text-slate-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} requests
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 enabled:hover:text-slate-100"
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
                            : "border border-slate-700 text-slate-300 hover:bg-slate-800"
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
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 enabled:hover:text-slate-100"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {error && requests.length > 0 && (
        <p className="text-[11px] text-rose-300">{error}</p>
      )}

      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-h-[90vh] max-w-2xl w-full rounded-lg border border-slate-700 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-100">
                {viewingFileType === 'nic' ? 'NIC Document' : 'Prescription Document'}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
              {isImageFile(viewingFile) ? (
                <div className="flex items-center justify-center bg-slate-900 p-4">
                  <img
                    src={getFileUrl(viewingFile)}
                    alt="Prescription"
                    className="max-w-full h-auto"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.parentElement.innerHTML = '<div class="text-center text-slate-400"><p>Failed to load image. Please try opening in a new window.</p></div>';
                    }}
                  />
                </div>
              ) : isPdfFile(viewingFile) ? (
                <iframe
                  src={getFileUrl(viewingFile)}
                  title="Prescription PDF"
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
                      href={getFileUrl(viewingFile)}
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

export default RequestsAdminList;

