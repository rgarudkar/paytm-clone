import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isAuthenticated: !!localStorage.getItem('auth'), // Initialize based on localStorage
  token: localStorage.getItem('auth') || null,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ username, password }) => {
    const response = await axios.post('http://localhost:3000/api/v1/user/signin', { username, password });
    return response.data.token;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('auth'); // Clear token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload;
        localStorage.setItem('auth', action.payload); // Persist token
      })
      .addCase(loginAsync.rejected, (state) => {
        state.error = 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
