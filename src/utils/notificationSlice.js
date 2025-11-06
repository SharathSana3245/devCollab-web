// notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    toasts: [],
  },
  reducers: {
    showToast: (state, action) => {
      state.toasts.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || "success",
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { showToast, removeToast } = notificationSlice.actions;
export default notificationSlice.reducer;
