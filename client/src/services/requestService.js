import axiosInstance from "../utils/axiosInstance";

// Requests service layer – all prescription request API calls.

export const createRequest = async (formData) => {
  const res = await axiosInstance.post("/requests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getUserRequests = async () => {
  const res = await axiosInstance.get("/requests/user");
  return res.data;
};

export const getAllRequests = async () => {
  const res = await axiosInstance.get("/requests");
  return res.data;
};

export const updateRequestStatus = async (id, status) => {
  const res = await axiosInstance.put(`/requests/${id}`, { status });
  return res.data;
};

