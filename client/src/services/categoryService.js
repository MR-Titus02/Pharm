import axiosInstance from "../utils/axiosInstance";

// Category service layer

export const fetchCategories = async () => {
  const res = await axiosInstance.get("/categories");
  return res.data;
};

export const createCategory = async (payload) => {
  const res = await axiosInstance.post("/categories", payload);
  return res.data;
};

export const updateCategory = async (id, payload) => {
  const res = await axiosInstance.put(`/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(`/categories/${id}`);
  return res.data;
};
