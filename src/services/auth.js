import api from './api';
import toast from 'react-hot-toast';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login successful!');
        return { success: true, user, accessToken };
      }
      return { success: false, message: response.data?.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get access token
  getToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/update-profile', userData);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        toast.success('Profile updated successfully');
        return { success: true, user: response.data.data.user };
      }
      return { success: false, message: response.data?.message || 'Update failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      if (response.data.success) {
        toast.success('Password changed successfully');
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Password change failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        toast.success('Password reset email sent');
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Request failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Request failed';
      toast.error(message);
      return { success: false, message };
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      if (response.data.success) {
        toast.success('Password reset successful');
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Reset failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Reset failed';
      toast.error(message);
      return { success: false, message };
    }
  },
};

export default authService;