import apiClient from './client';

export const pollsAPI = {
  getAll: (params) => apiClient.get('/admin/polls', { params }),
  getById: (id) => apiClient.get(`/admin/polls/${id}`),
  create: (data) => apiClient.post('/admin/polls', data),
  update: (id, data) => apiClient.put(`/admin/polls/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/polls/${id}`),
  publish: (id) => apiClient.post(`/admin/polls/${id}/publish`),
  unpublish: (id) => apiClient.post(`/admin/polls/${id}/unpublish`),
  getResults: (id) => apiClient.get(`/admin/polls/${id}/results`),
  exportResults: (id) => apiClient.get(`/admin/polls/${id}/export`, { responseType: 'blob' }),
};