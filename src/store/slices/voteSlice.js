import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
import toast from 'react-hot-toast';

export const fetchVotes = createAsyncThunk(
  'votes/fetchAll',
  async (params = {}) => {
    const response = await api.get('/admin/votes', { params });
    return response.data;
  }
);

export const fetchVoteStatistics = createAsyncThunk(
  'votes/fetchStatistics',
  async () => {
    const response = await api.get('/admin/votes/statistics');
    return response.data;
  }
);

const voteSlice = createSlice({
  name: 'votes',
  initialState: {
    votes: [],
    statistics: null,
    total: 0,
    pagination: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.votes = action.payload.data?.votes || [];
        state.total = action.payload.total || 0;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchVotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVoteStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      });
  },
});

export default voteSlice.reducer;