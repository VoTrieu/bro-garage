import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    slidebarIsVisible: true,
    isShowLoginDialog: false,
    isShowSpinner: false,
    toastContent: {},
  },
  reducers: {
    toggleSlidebar(state) {
      state.slidebarIsVisible = !state.slidebarIsVisible;
    },
    showLoginDialog(state, action) {
      state.isShowLoginDialog = action.payload;
    },
    setToastContent(state, action) {
      state.toastContent = action.payload;
    },
    showSpinner(state, action){
      state.isShowSpinner = action.payload;
    }
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
