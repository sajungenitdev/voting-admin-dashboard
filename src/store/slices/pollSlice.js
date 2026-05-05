import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import toast from "react-hot-toast";

let abortController = null;

export const fetchPolls = createAsyncThunk(
  "polls/fetchAll",
  async (params = {}) => {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    const response = await api.get("/admin/polls", {
      params,
      signal: abortController.signal,
    });
    return response.data;
  },
);

export const createPoll = createAsyncThunk("polls/create", async (pollData) => {
  const response = await api.post("/admin/polls", pollData);
  toast.success("Poll created successfully");
  return response.data.data.poll;
});

export const updatePoll = createAsyncThunk(
  "polls/update",
  async ({ id, data }) => {
    const response = await api.put(`/admin/polls/${id}`, data);
    toast.success("Poll updated successfully");
    return { id, data: response.data.data.poll };
  },
);

export const deletePoll = createAsyncThunk("polls/delete", async (id) => {
  await api.delete(`/admin/polls/${id}`);
  toast.success("Poll deleted successfully");
  return id;
});

export const publishPoll = createAsyncThunk("polls/publish", async (id) => {
  const response = await api.post(`/admin/polls/${id}/publish`);
  toast.success("Poll published");
  return { id, isPublished: true };
});

export const unpublishPoll = createAsyncThunk("polls/unpublish", async (id) => {
  const response = await api.post(`/admin/polls/${id}/unpublish`);
  toast.success("Poll unpublished");
  return { id, isPublished: false };
});

const pollSlice = createSlice({
  name: "polls",
  initialState: {
    polls: [],
    selectedPoll: null,
    total: 0,
    pagination: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedPoll: (state, action) => {
      state.selectedPoll = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.polls = action.payload.data?.polls || [];
        state.total = action.payload.total || 0;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        if (action.error.name !== "AbortError") {
          state.error = action.error.message;
        }
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.polls.unshift(action.payload);
      })
      .addCase(updatePoll.fulfilled, (state, action) => {
        const index = state.polls.findIndex((p) => p._id === action.payload.id);
        if (index !== -1) state.polls[index] = action.payload.data;
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.polls = state.polls.filter((p) => p._id !== action.payload);
      })
      .addCase(publishPoll.fulfilled, (state, action) => {
        const poll = state.polls.find((p) => p._id === action.payload.id);
        if (poll) poll.isPublished = true;
      })
      .addCase(unpublishPoll.fulfilled, (state, action) => {
        const poll = state.polls.find((p) => p._id === action.payload.id);
        if (poll) poll.isPublished = false;
      });
  },
});

export const { setSelectedPoll } = pollSlice.actions;
export default pollSlice.reducer;
