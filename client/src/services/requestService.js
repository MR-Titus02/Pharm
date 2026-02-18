import axiosInstance from "../utils/axiosInstance";

// Requests service layer – all prescription request API calls.

export const createRequest = async (formData) => {
  const res = await axiosInstance.post("/requests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getUserRequests = async (page = 1, limit = 10) => {
  const res = await axiosInstance.get("/requests/user", {
    params: { page, limit },
  });
  return res.data;
};

export const getAllRequests = async (page = 1, limit = 10, status = null) => {
  const params = { page, limit };
  if (status) params.status = status;
  const res = await axiosInstance.get("/requests", { params });
  return res.data;
};

export const updateRequestStatus = async (id, status) => {
  const res = await axiosInstance.put(`/requests/${id}`, { status });
  return res.data;
};

export const updateDeliveryStatus = async (id, deliveryStatus, deliveryNotes = "") => {
  const res = await axiosInstance.put(`/requests/${id}/delivery`, { 
    deliveryStatus,
    deliveryNotes,
  });
  return res.data;
};

