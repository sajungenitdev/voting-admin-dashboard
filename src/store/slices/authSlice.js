import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import toast from "react-hot-toast";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful!");
        return { user, accessToken };
      }
      return rejectWithValue(response.data?.message || "Login failed");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
  return null;
});

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password changed successfully");
        return response.data;
      }
      return rejectWithValue(
        response.data?.message || "Password change failed",
      );
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/update-profile", userData);
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        toast.success("Profile updated successfully");
        return response.data.data.user;
      }
      return rejectWithValue(response.data?.message || "Update failed");
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data.success) {
        toast.success("Password reset email sent");
        return response.data;
      }
      return rejectWithValue(response.data?.message || "Request failed");
    } catch (error) {
      const message = error.response?.data?.message || "Request failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });
      if (response.data.success) {
        toast.success("Password reset successful");
        return response.data;
      }
      return rejectWithValue(response.data?.message || "Reset failed");
    } catch (error) {
      const message = error.response?.data?.message || "Reset failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("accessToken") || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
