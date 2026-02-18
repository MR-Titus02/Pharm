import React, { useEffect, useState } from "react";
import { getAllPayments } from "../../services/paymentService";
import { useToast } from "../../context/ToastContext";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

const PaymentsAdminList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filter, setFilter] = useState("all");
  const { showToast } = useToast();

  const loadPayments = async (page = 1, filterStatus = filter) => {
    try {
      setError("");
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }
      const data = await getAllPayments(params);
      setPayments(Array.isArray(data) ? data : data?.payments || []);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments(1, filter);
  }, [filter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadPayments(newPage, filter);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) return <LoadingState message="Loading payments..." />;
  if (error) return <ErrorState message={error} />;
  if (payments.length === 0)
    return (
      <EmptyState
        message="No payments found"
        icon="💳"
        action="Review requests to process payments"
      />
    );

  const totalAmount = payments.reduce((sum, p) => sum + (p.medicineId?.price || 0), 0);
  const avgAmount = payments.length > 0 ? totalAmount / payments.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Payment Management</h1>
        <p className="text-sm text-slate-600">View and manage all transaction payments</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">${totalAmount.toFixed(2)}</p>
          <p className="mt-1 text-xs text-emerald-600">{payments.length} transactions</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4 shadow-sm">
          <p className="text-xs font-semibold text-sky-600 uppercase">Avg Transaction</p>
          <p className="mt-2 text-2xl font-bold text-sky-700">${avgAmount.toFixed(2)}</p>
          <p className="mt-1 text-xs text-sky-600">per request</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 uppercase">This Page</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">{payments.length}</p>
          <p className="mt-1 text-xs text-amber-600">of {pagination.total} total</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "paid", "pending", "failed"].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === status
                ? "bg-sky-600 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Request ID</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">User</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Medicine</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-900">Amount</th>
              <th className="px-6 py-3 text-center font-semibold text-slate-900">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-900">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="border-b border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-3 font-mono text-xs text-slate-600">
                  {payment._id?.substring(0, 8)}...
                </td>
                <td className="px-6 py-3">
                  <div>
                    <p className="font-medium text-slate-900">{payment.userId?.name || "—"}</p>
                    <p className="text-xs text-slate-500">{payment.userId?.email || "—"}</p>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="text-slate-900">{payment.medicineId?.name || "—"}</p>
                  <p className="text-xs text-slate-500">{payment.medicineId?.category || "—"}</p>
                </td>
                <td className="px-6 py-3 text-right font-semibold text-emerald-600">
                  ${payment.medicineId?.price?.toFixed(2) || "0.00"}
                </td>
                <td className="px-6 py-3 text-center">
                  <StatusBadge variant={payment.paymentStatus || "pending"} label={payment.paymentStatus} />
                </td>
                <td className="px-6 py-3 text-sm text-slate-600">
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              ← Previous
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pagination.page === page
                    ? "bg-sky-600 text-white"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsAdminList;
