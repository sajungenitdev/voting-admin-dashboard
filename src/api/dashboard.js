import apiClient from './client';

export const dashboardAPI = {
  getStats: () => apiClient.get('/admin/dashboard'),
  getAnalytics: (period = 'month') => apiClient.get(`/admin/analytics?period=${period}`),
  getActivityLogs: (params) => apiClient.get('/admin/logs/activity', { params }),
  getSystemLogs: () => apiClient.get('/admin/system/logs'),
  clearCache: () => apiClient.post('/admin/system/cache/clear'),
  getBackup: () => apiClient.get('/admin/system/backup', { responseType: 'blob' }),
};