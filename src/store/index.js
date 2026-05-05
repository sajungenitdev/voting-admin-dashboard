import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import pollReducer from './slices/pollSlice';
import voteReducer from './slices/voteSlice';
import commentReducer from './slices/commentSlice';
import b2bReducer from './slices/b2bSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    polls: pollReducer,
    votes: voteReducer,
    comments: commentReducer,
    b2b: b2bReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});