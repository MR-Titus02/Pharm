import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserRequests } from "../../services/requestService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

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

const UserRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadRequests = async (page = 1) => {
    try {
      setError("");
      setLoading(true);
      const data = await getUserRequests(page, 10);
      setRequests(Array.isArray(data) ? data : data?.requests || []);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load your requests. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadRequests(newPage);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your requests..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => loadRequests(1)} />;
  }

  if (!requests.length) {
    return (
      <div className="space-y-4">
        <header className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              My requests
            </h1>
            <p className="text-xs text-slate-400">
              Track the status of your prescription requests.
            </p>
          </div>
          <Link
            to="/requests/new"
            className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            + New request
          </Link>
        </header>
        <EmptyState
          title="No requests yet"
          description="Create your first prescription request to see it listed here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            My requests
          </h1>
          <p className="text-xs text-slate-400">
            Track the status of your prescription requests. Delivery status will be updated once your request is approved and paid.
          </p>
        </div>
        <Link
          to="/requests/new"
          className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + New request
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
        <table className="min-w-full divide-y divide-slate-800 text-xs">
          <thead className="bg-slate-900/70">
            <tr>
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
              const medicine = request.medicineId;
              const hasPrescription = Boolean(request.prescriptionFile);
              const createdAt = request.createdAt
                ? new Date(request.createdAt)
                : null;

              return (
                <tr key={request._id} className="hover:bg-slate-900/70">
                  <td className="px-4 py-2 text-slate-100">
                    {medicine?.name || "Unknown medicine"}
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
                    <StatusBadge
                      label={
                        (request.deliveryStatus || "pending").charAt(0).toUpperCase() +
                        (request.deliveryStatus || "pending").slice(1)
                      }
                      variant={getDeliveryVariant(request.deliveryStatus || "pending")}
                    />
                  </td>
                  <td className="px-4 py-2 text-[11px] text-slate-300">
                    {hasPrescription ? "Attached" : "Not required"}
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
                    {request.status === "approved" && request.paymentStatus === "paid" && (
                      <span className="text-xs font-semibold text-emerald-400">Paid</span>
                    )}
                    {request.status === "approved" && request.paymentStatus !== "paid" && (
                      <Link
                        to="/payment"
                        state={{ request }}
                        className="rounded bg-sky-600 px-2 py-1 text-xs font-semibold text-white hover:bg-sky-700"
                      >
                        Pay Now
                      </Link>
                    )}
                    {request.status === "rejected" && (
                      <span className="text-xs text-rose-400">Rejected</span>
                    )}
                    {request.status === "pending" && (
                      <span className="text-xs text-slate-400">Awaiting approval...</span>
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
    </div>
  );
};

export default UserRequestsList;

