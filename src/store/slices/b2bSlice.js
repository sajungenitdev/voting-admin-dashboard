import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
import toast from 'react-hot-toast';

export const fetchB2BRequests = createAsyncThunk(
  'b2b/fetchRequests',
  async (params = {}) => {
    const response = await api.get('/admin/b2b/requests', { params });
    return response.data;
  }
);

export const fetchB2BSubscriptions = createAsyncThunk(
  'b2b/fetchSubscriptions',
  async (params = {}) => {
    const response = await api.get('/admin/b2b/subscriptions', { params });
    return response.data;
  }
);

export const fetchB2BPayments = createAsyncThunk(
  'b2b/fetchPayments',
  async (params = {}) => {
    const response = await api.get('/admin/b2b/payments', { params });
    return response.data;
  }
);

export const approveB2BRequest = createAsyncThunk(
  'b2b/approveRequest',
  async (id) => {
    const response = await api.post(`/admin/b2b/requests/${id}/approve`);
    toast.success('Request approved');
    return { id, status: 'approved' };
  }
);

export const rejectB2BRequest = createAsyncThunk(
  'b2b/rejectRequest',
  async ({ id, reason }) => {
    const response = await api.post(`/admin/b2b/requests/${id}/reject`, { reason });
    toast.success('Request rejected');
    return { id, status: 'rejected' };
  }
);

const b2bSlice = createSlice({
  name: 'b2b',
  initialState: {
    requests: [],
    subscriptions: [],
    payments: [],
    total: 0,
    pagination: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchB2BRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchB2BRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.data?.requests || [];
        state.total = action.payload.total || 0;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchB2BRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchB2BSubscriptions.fulfilled, (state, action) => {
        state.subscriptions = action.payload.data?.subscriptions || [];
      })
      .addCase(fetchB2BPayments.fulfilled, (state, action) => {
        state.payments = action.payload.data?.payments || [];
      })
      .addCase(approveB2BRequest.fulfilled, (state, action) => {
        const request = state.requests.find(r => r._id === action.payload.id);
        if (request) {
          request.status = 'approved';
        }
      })
      .addCase(rejectB2BRequest.fulfilled, (state, action) => {
        const request = state.requests.find(r => r._id === action.payload.id);
        if (request) {
          request.status = 'rejected';
        }
      });
  },
});

export default b2bSlice.reducer;