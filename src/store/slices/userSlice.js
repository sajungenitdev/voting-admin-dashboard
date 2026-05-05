import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import toast from "react-hot-toast";

let abortController = null;

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    try {
      const response = await api.get("/admin/users", {
        params,
        signal: abortController.signal,
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        return {
          users: response.data.data?.users || [],
          total:
            response.data.data?.pagination?.total || response.data.total || 0,
          pagination: response.data.data?.pagination ||
            response.data.pagination || {
              page: params.page || 1,
              limit: params.limit || 20,
              total: 0,
              pages: 1,
            },
        };
      } else {
        return rejectWithValue(
          response.data?.message || "Failed to fetch users",
        );
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      if (error.name === "CanceledError") {
        return rejectWithValue("canceled");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch users",
      );
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "users/updateRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role });
      if (response.data.success) {
        toast.success("User role updated");
        return { id, role };
      }
      return rejectWithValue(response.data?.message || "Failed to update role");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update role";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const toggleUserStatus = createAsyncThunk(
  "users/toggleStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${id}/status`, { isActive });
      if (response.data.success) {
        toast.success(`User ${isActive ? "activated" : "deactivated"}`);
        return { id, isActive };
      }
      return rejectWithValue(
        response.data?.message || "Failed to update status",
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update status";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
        return id;
      }
      return rejectWithValue(response.data?.message || "Failed to delete user");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/users", userData);
      if (response.data.success) {
        toast.success("User created successfully");
        return response.data.data.user;
      }
      return rejectWithValue(response.data?.message || "Failed to create user");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create user";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    total: 0,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 1,
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUsers: (state) => {
      state.users = [];
      state.total = 0;
      state.pagination = { page: 1, limit: 20, total: 0, pages: 1 };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users || [];
        state.total = action.payload.total || 0;
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1,
        };
        state.error = null;
        console.log("✅ Users loaded:", state.users.length);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload !== "canceled") {
          state.error = action.payload || "Failed to fetch users";
          console.error("❌ Fetch users error:", action.payload);
        }
      })
      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const user = state.users.find((u) => u._id === action.payload.id);
        if (user) {
          user.role = action.payload.role;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        console.error("❌ Update role error:", action.payload);
      })
      // Toggle User Status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const user = state.users.find((u) => u._id === action.payload.id);
        if (user) {
          user.isActive = action.payload.isActive;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        console.error("❌ Toggle status error:", action.payload);
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.total = state.users.length;
        state.pagination.total = state.users.length;
        state.pagination.pages = Math.ceil(
          state.users.length / state.pagination.limit,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        console.error("❌ Delete user error:", action.payload);
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.unshift(action.payload);
        state.total = state.users.length;
        state.pagination.total = state.users.length;
        state.pagination.pages = Math.ceil(
          state.users.length / state.pagination.limit,
        );
        state.error = null;
        console.log("✅ User created:", action.payload.email);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create user";
        console.error("❌ Create user error:", action.payload);
      });
  },
});

export const { clearError, resetUsers } = userSlice.actions;
export default userSlice.reducer;
