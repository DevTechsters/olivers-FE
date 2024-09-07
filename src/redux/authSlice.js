// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      sessionStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      sessionStorage.removeItem('user');
    },
    setUserFromSession: (state) => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        state.isAuthenticated = true;
        state.user = JSON.parse(storedUser);
      }
    },
  },
});

export const { login, logout, setUserFromSession } = authSlice.actions;
export default authSlice.reducer;
