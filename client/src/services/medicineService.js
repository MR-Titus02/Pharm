import axiosInstance from "../utils/axiosInstance";

// Medicines service layer – all medicine-related API calls live here.
// Backed by /api/medicines routes on the server.

export const fetchMedicines = async () => {
  const res = await axiosInstance.get("/medicines");
  return res.data;
};

export const fetchMedicineById = async (id) => {
  const res = await axiosInstance.get(`/medicines/${id}`);
  return res.data;
};

// Admin-only actions

export const createMedicine = async (payload) => {
  const res = await axiosInstance.post("/medicines", payload);
  return res.data;
};

export const updateMedicine = async (id, payload) => {
  const res = await axiosInstance.put(`/medicines/${id}`, payload);
  return res.data;
};

export const deleteMedicine = async (id) => {
  const res = await axiosInstance.delete(`/medicines/${id}`);
  return res.data;
};


