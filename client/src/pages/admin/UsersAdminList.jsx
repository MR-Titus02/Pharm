import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../../services/userService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../context/ToastContext";
import StatusBadge from "../../components/StatusBadge";

const UsersAdminList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  
  const { showToast } = useToast();

  const loadUsers = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return;

    try {
      setDeletingId(id);
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast({ type: "success", message: "User deleted." });
    } catch (err) {
      showToast({ type: "error", message: "Failed to delete user." });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingState message="Loading users..." />;
  if (error) return <ErrorState message={error} onRetry={loadUsers} />;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-lg font-semibold text-slate-900">
          Manage Users
        </h1>
        <p className="text-xs text-slate-500">
          View registered users and manage their access.
        </p>
      </header>

      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Wait for users to register."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left font-semibold text-slate-700">
                  Role
                </th>
                <th className="px-4 py-2 text-right font-semibold text-slate-700">
                  Joined
                </th>
                <th className="px-4 py-2 text-right font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2 text-slate-800 font-medium">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 text-slate-500">
                    {user.email}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge
                      label={user.role}
                      variant={user.role === "admin" ? "success" : "info"}
                    />
                  </td>
                  <td className="px-4 py-2 text-right text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        disabled={deletingId === user._id}
                        className="text-rose-600 hover:text-rose-700 disabled:opacity-50"
                      >
                        {deletingId === user._id ? "..." : "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersAdminList;
