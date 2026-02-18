import axiosInstance from "../utils/axiosInstance";

export const fetchDashboardStats = async () => {
  const res = await axiosInstance.get("/reports/dashboard");
  return res.data;
};

export const fetchUserStats = async () => {
  const res = await axiosInstance.get("/reports/user-stats");
  return res.data;
};

export const fetchAdminReports = async () => {
  const res = await axiosInstance.get("/reports/admin");
  return res.data;
};
