// src/store/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },
);

export const fetchAnalytics = createAsyncThunk(
  "dashboard/fetchAnalytics",
  async (period = "month") => {
    const response = await api.get(`/admin/analytics?period=${period}`);
    return response.data;
  },
);

export const fetchActivityLogs = createAsyncThunk(
  "dashboard/fetchActivityLogs",
  async (params = {}) => {
    const response = await api.get("/admin/logs/activity", { params });
    return response.data;
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    analytics: null,
    activityLogs: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics = action.payload.data;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLogs = action.payload.data?.logs || [];
      });
  },
});

export default dashboardSlice.reducer;
