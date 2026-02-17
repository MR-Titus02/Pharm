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
        const inStock = (m.stock ?? 0) > 0;
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
          <div className="relative w-full sm:w-48">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900/80 pl-9 pr-8 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500 hover:text-slate-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
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
          {(searchTerm ||
            categoryFilter !== "all" ||
            availabilityFilter !== "all" ||
            maxPrice) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setAvailabilityFilter("all");
                setMaxPrice("");
              }}
              className="rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Reset
            </button>
          )}
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

