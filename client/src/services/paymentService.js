import axiosInstance from "../utils/axiosInstance";

export const processPayment = async (paymentDetails) => {
  const res = await axiosInstance.post("/payments/process", paymentDetails);
  return res.data;
};

export const getAllPayments = async (params = {}) => {
  const res = await axiosInstance.get("/payments", { params });
  return res.data;
};
