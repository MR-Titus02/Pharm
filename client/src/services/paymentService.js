import axiosInstance from "../utils/axiosInstance";

export const processPayment = async (paymentDetails) => {
  const res = await axiosInstance.post("/payments/process", paymentDetails);
  return res.data;
};
