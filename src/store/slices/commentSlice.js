import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';
import toast from 'react-hot-toast';

export const fetchComments = createAsyncThunk(
  'comments/fetchAll',
  async (params = {}) => {
    const response = await api.get('/admin/comments', { params });
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (id) => {
    await api.delete(`/admin/comments/${id}`);
    toast.success('Comment deleted successfully');
    return id;
  }
);

export const moderateComment = createAsyncThunk(
  'comments/moderate',
  async ({ id, status }) => {
    const response = await api.put(`/admin/comments/${id}/moderate`, { status });
    toast.success(`Comment ${status}`);
    return { id, status };
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    total: 0,
    pagination: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload.data?.comments || [];
        state.total = action.payload.total || 0;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c._id !== action.payload);
      })
      .addCase(moderateComment.fulfilled, (state, action) => {
        const comment = state.comments.find(c => c._id === action.payload.id);
        if (comment) {
          comment.status = action.payload.status;
        }
      });
  },
});

export default commentSlice.reducer;