import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import toast from "react-hot-toast";

let abortController = null;

// Fetch all votes (admin)
export const fetchVotes = createAsyncThunk(
  "votes/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    try {
      const response = await api.get("/admin/votes", {
        params,
        signal: abortController.signal,
      });

      if (response.data && response.data.success) {
        return {
          votes: response.data.data?.votes || [],
          total: response.data.total || 0,
          pagination: response.data.pagination || {
            page: 1,
            limit: 50,
            total: 0,
            pages: 1,
          },
        };
      }
      return rejectWithValue(response.data?.message || "Failed to fetch votes");
    } catch (error) {
      if (error.name === "CanceledError") {
        return rejectWithValue("canceled");
      }
      console.error("Fetch votes error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch votes",
      );
    }
  },
);

// Cast a vote
export const castVote = createAsyncThunk(
  "votes/cast",
  async ({ pollId, candidateId }, { rejectWithValue }) => {
    try {
      const response = await api.post("/votes", { pollId, candidateId });
      if (response.data.success) {
        toast.success(response.data.message || "Vote cast successfully!");
        return response.data.data;
      }
      return rejectWithValue(response.data?.message || "Failed to cast vote");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cast vote";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// Get user's vote history
export const fetchMyVotes = createAsyncThunk(
  "votes/fetchMyVotes",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/votes/my-votes", { params });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data?.message || "Failed to fetch votes");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch votes";
      return rejectWithValue(message);
    }
  },
);

// Check if user has voted in a poll
export const checkHasVoted = createAsyncThunk(
  "votes/checkHasVoted",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/votes/check/${pollId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data?.message || "Failed to check vote status",
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to check vote status";
      return rejectWithValue(message);
    }
  },
);

// Get vote receipt
export const fetchVoteReceipt = createAsyncThunk(
  "votes/fetchReceipt",
  async (voteId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/votes/receipt/${voteId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data?.message || "Failed to fetch receipt",
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch receipt";
      return rejectWithValue(message);
    }
  },
);

// Get poll vote results
export const fetchPollResults = createAsyncThunk(
  "votes/fetchPollResults",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/votes/results/${pollId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data?.message || "Failed to fetch results",
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch results";
      return rejectWithValue(message);
    }
  },
);

// Get voting statistics (admin)
export const fetchVoteStatistics = createAsyncThunk(
  "votes/fetchStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/votes/statistics");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(
        response.data?.message || "Failed to fetch statistics",
      );
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch statistics";
      return rejectWithValue(message);
    }
  },
);

const voteSlice = createSlice({
  name: "votes",
  initialState: {
    votes: [],
    myVotes: [],
    statistics: null,
    currentReceipt: null,
    pollResults: null,
    total: 0,
    pagination: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReceipt: (state) => {
      state.currentReceipt = null;
    },
    clearResults: (state) => {
      state.pollResults = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Votes (Admin)
      .addCase(fetchVotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.votes = action.payload.votes || [];
        state.total = action.payload.total || 0;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchVotes.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload !== "canceled") {
          state.error = action.payload;
        }
      })

      // Cast Vote
      .addCase(castVote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(castVote.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add to myVotes if needed
        if (action.payload) {
          state.myVotes.unshift(action.payload);
        }
      })
      .addCase(castVote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch My Votes
      .addCase(fetchMyVotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyVotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myVotes = action.payload?.votes || [];
        state.total = action.payload?.total || 0;
        state.pagination = action.payload?.pagination || {};
      })
      .addCase(fetchMyVotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check Has Voted
      .addCase(checkHasVoted.fulfilled, (state, action) => {
        // This doesn't need to store in state, just used for checking
      })

      // Fetch Vote Receipt
      .addCase(fetchVoteReceipt.fulfilled, (state, action) => {
        state.currentReceipt = action.payload?.receipt || null;
      })

      // Fetch Poll Results
      .addCase(fetchPollResults.fulfilled, (state, action) => {
        state.pollResults = action.payload;
      })

      // Fetch Vote Statistics (Admin)
      .addCase(fetchVoteStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  },
});

export const { clearError, clearReceipt, clearResults } = voteSlice.actions;
export default voteSlice.reducer;
