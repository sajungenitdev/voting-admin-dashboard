import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Track shown errors to prevent duplicate toasts
const shownErrors = new Set();
let errorTimeout;

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add cache busting for GET requests
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, code, message } = error;

    // ✅ Skip showing toasts for canceled requests (debounce)
    if (
      code === "ERR_CANCELED" ||
      error.name === "CanceledError" ||
      message === "canceled"
    ) {
      console.log("Request was canceled (debounce) - ignoring error toast");
      return Promise.reject(error);
    }

    // Network error
    if (code === "ERR_NETWORK" || code === "ECONNREFUSED") {
      const msg =
        "Cannot connect to server. Make sure backend is running on port 5000.";
      if (!shownErrors.has(msg)) {
        shownErrors.add(msg);
        toast.error(msg);
        setTimeout(() => shownErrors.clear(), 3000);
      }
      return Promise.reject(error);
    }

    const errorMessage = response?.data?.message || "An error occurred";

    // Skip duplicate errors
    if (shownErrors.has(errorMessage)) {
      return Promise.reject(error);
    }

    shownErrors.add(errorMessage);

    // Handle specific error types
    if (response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
      }
    } else if (response?.status === 403) {
      toast.error("You don't have permission.");
    } else if (response?.status === 429) {
      toast.error("Too many requests. Please slow down.");
    } else if (response?.status >= 500) {
      toast.error("Server error. Please try again.");
    } else if (errorMessage !== "Request failed with status code 404") {
      // Only show toast for actual errors, not canceled requests
      toast.error(errorMessage);
    }

    setTimeout(() => shownErrors.clear(), 2000);
    return Promise.reject(error);
  },
);

export default apiClient;
