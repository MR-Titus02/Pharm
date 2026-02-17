import React, { useEffect, useMemo, useState } from "react";
import { fetchMedicines } from "../../services/medicineService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import MedicineCard from "../../components/MedicineCard";

const UserMedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const loadMedicines = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchMedicines();
      setMedicines(Array.isArray(data) ? data : data?.medicines || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load medicines.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    medicines.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set).sort();
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const nameMatch = m.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (!nameMatch) return false;

      if (categoryFilter !== "all" && m.category !== categoryFilter) {
        return false;
      }

      if (availabilityFilter !== "all") {
        const inStock =
          typeof m.inStock === "boolean"
            ? m.inStock
            : (m.stock ?? 0) > 0;
        if (
          availabilityFilter === "in" &&
          !inStock
        ) {
          return false;
        }
        if (
          availabilityFilter === "out" &&
          inStock
        ) {
          return false;
        }
      }

      if (maxPrice) {
        const priceOk =
          typeof m.price === "number"
            ? m.price <= Number(maxPrice)
            : true;
        if (!priceOk) return false;
      }

      return true;
    });
  }, [medicines, searchTerm, categoryFilter, availabilityFilter, maxPrice]);

  if (loading) {
    return <LoadingState message="Fetching available medicines..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMedicines} />;
  }

  if (!medicines.length) {
    return (
      <EmptyState
        title="No medicines available"
        description="Once the pharmacy adds medicines, you will see them listed here."
      />
    );
  }

  return (
    <div>
      <header className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Medicines
          </h1>
          <p className="text-xs text-slate-400">
            Browse and filter available medicines. Prescription rules are enforced when you submit a request.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:w-48"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-32 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-2 text-xs text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-32 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-2 text-xs text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All stock</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price"
            className="w-24 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </header>

      {filteredMedicines.length === 0 ? (
        <EmptyState
          title="No medicines match your filters"
          description="Try clearing some filters or adjusting your search."
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine._id} medicine={medicine} />
          ))}
        </section>
      )}
    </div>
  );
};

export default UserMedicinesList;

