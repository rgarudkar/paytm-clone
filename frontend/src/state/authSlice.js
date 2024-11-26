import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isAuthenticated: !!localStorage.getItem('auth'), // Initialize based on localStorage
  token: localStorage.getItem('auth') || null,
  error: null,
  username : localStorage.getItem('username') || null
};

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ username, password }) => {
    const response = await axios.post('http://localhost:3000/api/v1/user/signin', { username, password });
    return {token : response.data.token, user: response.data.user};
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.username = null;
      localStorage.removeItem('username')
      localStorage.removeItem('auth'); // Clear token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        console.log(action.payload,"hello payload");
        state.token = action.payload.token;
        state.username = action.payload.user;
        localStorage.setItem('auth', action.payload.token); // Persist token
        localStorage.setItem('username',action.payload.user);
      })
      .addCase(loginAsync.rejected, (state) => {
        state.error = 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
