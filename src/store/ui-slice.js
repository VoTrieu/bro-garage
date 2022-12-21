import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    slidebarIsVisible: true,
    isShowChangePasswordDialog: false,
    isShowSpinner: false,
    toastContent: {},
  },
  reducers: {
    toggleSlidebar(state) {
      state.slidebarIsVisible = !state.slidebarIsVisible;
    },
    showChangePasswordDialog(state, action) {
      state.isShowChangePasswordDialog = action.payload;
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
