import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import toast from "react-hot-toast";

// ==================== B2B REQUESTS ====================
export const fetchB2BRequests = createAsyncThunk(
  "b2b/fetchRequests",
  async (params = {}) => {
    const response = await api.get("/admin/b2b/requests", { params });
    return response.data;
  },
);

export const approveB2BRequest = createAsyncThunk(
  "b2b/approveRequest",
  async (id) => {
    const response = await api.put(`/admin/b2b/requests/${id}/approve`);
    toast.success("Request approved successfully");
    return { id, status: "approved" };
  },
);

export const rejectB2BRequest = createAsyncThunk(
  "b2b/rejectRequest",
  async ({ id, reason }) => {
    const response = await api.post(`/admin/b2b/requests/${id}/reject`, {
      reason,
    });
    toast.success("Request rejected");
    return { id, status: "rejected", reason };
  },
);

// ==================== B2B SUBSCRIPTIONS ====================
export const fetchB2BSubscriptions = createAsyncThunk(
  "b2b/fetchSubscriptions",
  async (params = {}) => {
    const response = await api.get("/admin/b2b/subscriptions", { params });
    return response.data;
  },
);

// ==================== B2B PAYMENTS ====================
export const fetchB2BPayments = createAsyncThunk(
  "b2b/fetchPayments",
  async (params = {}) => {
    const response = await api.get("/admin/b2b/payments", { params });
    return response.data;
  },
);

// ==================== B2B USERS ====================
export const fetchB2BUsers = createAsyncThunk(
  "b2b/fetchUsers",
  async (params = {}) => {
    const response = await api.get("/admin/b2b/users", { params });
    return response.data;
  },
);

// ==================== B2B CATEGORIES ====================
export const fetchB2BCategories = createAsyncThunk(
  "b2b/fetchCategories",
  async () => {
    const response = await api.get("/admin/b2b/categories");
    return response.data;
  },
);

export const createB2BCategory = createAsyncThunk(
  "b2b/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/b2b/categories", categoryData);
      toast.success("Category created successfully");
      return response.data.data.category;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create category";
      console.error("Create category error:", error.response?.data);
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const updateB2BCategory = createAsyncThunk(
  "b2b/updateCategory",
  async ({ id, data }) => {
    const response = await api.put(`/admin/b2b/categories/${id}`, data);
    toast.success("Category updated successfully");
    return response.data.data.category;
  },
);

export const deleteB2BCategory = createAsyncThunk(
  "b2b/deleteCategory",
  async (id) => {
    await api.delete(`/admin/b2b/categories/${id}`);
    toast.success("Category deleted successfully");
    return id;
  },
);

// ==================== INITIAL STATE ====================
const initialState = {
  // B2B Requests
  requests: [],
  // B2B Subscriptions
  subscriptions: [],
  // B2B Payments
  payments: [],
  // B2B Users
  b2bUsers: [],
  // B2B Categories
  b2bCategories: [],
  // Pagination & Meta
  total: 0,
  pagination: {},
  // UI State
  isLoading: false,
  error: null,
};

// ==================== SLICE ====================
const b2bSlice = createSlice({
  name: "b2b",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearB2BData: (state) => {
      state.requests = [];
      state.subscriptions = [];
      state.payments = [];
      state.b2bUsers = [];
      state.b2bCategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== FETCH B2B REQUESTS ====================
      .addCase(fetchB2BRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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

      // ==================== FETCH B2B SUBSCRIPTIONS ====================
      .addCase(fetchB2BSubscriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchB2BSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = action.payload.data?.subscriptions || [];
      })
      .addCase(fetchB2BSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // ==================== FETCH B2B PAYMENTS ====================
      .addCase(fetchB2BPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchB2BPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload.data?.payments || [];
      })
      .addCase(fetchB2BPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // ==================== FETCH B2B USERS ====================
      .addCase(fetchB2BUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchB2BUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.b2bUsers = action.payload.data?.users || [];
        state.total = action.payload.total || 0;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchB2BUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // ==================== FETCH B2B CATEGORIES ====================
      .addCase(fetchB2BCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchB2BCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.b2bCategories = action.payload.data?.categories || [];
      })
      .addCase(fetchB2BCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // ==================== CREATE B2B CATEGORY ====================
      .addCase(createB2BCategory.fulfilled, (state, action) => {
        state.b2bCategories.push(action.payload);
      })

      // ==================== UPDATE B2B CATEGORY ====================
      .addCase(updateB2BCategory.fulfilled, (state, action) => {
        const index = state.b2bCategories.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index !== -1) {
          state.b2bCategories[index] = action.payload;
        }
      })

      // ==================== DELETE B2B CATEGORY ====================
      .addCase(deleteB2BCategory.fulfilled, (state, action) => {
        state.b2bCategories = state.b2bCategories.filter(
          (c) => c._id !== action.payload,
        );
      })

      // ==================== APPROVE B2B REQUEST ====================
      .addCase(approveB2BRequest.fulfilled, (state, action) => {
        const request = state.requests.find((r) => r._id === action.payload.id);
        if (request) {
          request.status = "approved";
          request.approvedAt = new Date().toISOString();
        }
      })

      // ==================== REJECT B2B REQUEST ====================
      .addCase(rejectB2BRequest.fulfilled, (state, action) => {
        const request = state.requests.find((r) => r._id === action.payload.id);
        if (request) {
          request.status = "rejected";
          request.rejectionReason = action.payload.reason;
        }
      });
  },
});

// ==================== EXPORTS ====================
export const { clearError, clearB2BData } = b2bSlice.actions;
export default b2bSlice.reducer;
