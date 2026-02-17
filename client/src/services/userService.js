import axiosInstance from "../utils/axiosInstance";

// User service layer

export const fetchUsers = async () => {
  const res = await axiosInstance.get("/auth/users");
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axiosInstance.delete(`/auth/users/${id}`);
  return res.data;
};
