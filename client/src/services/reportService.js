import axiosInstance from "../utils/axiosInstance";

export const fetchDashboardStats = async () => {
  const res = await axiosInstance.get("/reports/dashboard");
  return res.data;
};
