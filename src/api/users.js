import apiClient from "./client";

export const usersAPI = {
  getAll: (params) => apiClient.get("/admin/users", { params }),
  getById: (id) => apiClient.get(`/admin/users/${id}`),
  updateRole: (id, role) => apiClient.put(`/admin/users/${id}/role`, { role }),
  updateStatus: (id, isActive) =>
    apiClient.put(`/admin/users/${id}/status`, { isActive }),
  delete: (id) => apiClient.delete(`/admin/users/${id}`),
};
export const createUser = (userData) =>
  apiClient.post("/admin/users", userData);
