import apiClient from './client';

export const b2bAPI = {
  getRequests: (params) => apiClient.get('/admin/b2b/requests', { params }),
  approveRequest: (id) => apiClient.post(`/admin/b2b/requests/${id}/approve`),
  rejectRequest: (id, reason) => apiClient.post(`/admin/b2b/requests/${id}/reject`, { reason }),
  getSubscriptions: (params) => apiClient.get('/admin/b2b/subscriptions', { params }),
  getPayments: (params) => apiClient.get('/admin/b2b/payments', { params }),
  getUsers: (params) => apiClient.get('/admin/b2b/users', { params }),
  getCategories: () => apiClient.get('/admin/b2b/categories'),
};