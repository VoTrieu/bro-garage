import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { slidebarIsVisible: true, isShowLoginDialog: false },
  reducers: {
    toggleSlidebar(state) {
      state.slidebarIsVisible = !state.slidebarIsVisible;
    },
    showLoginDialog(state, action) {
      state.isShowLoginDialog = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
