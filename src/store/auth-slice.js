import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loginSuccess: true,
    errorMessage: "",
    userName: "",
    fullName: "",
    accessToken: "",
    refreshToken: "",
    isTokenValid: false,
  },
  reducers: {
    setCurrentAuthorization(state, action) {
      state.userName = action.payload?.Result?.UserName || "";
      state.fullName = action.payload?.Result?.FullName || "";
      state.accessToken = action.payload?.Result?.AccessToken || "";
      state.refreshToken = action.payload?.Result?.RefreshToken || "";
      state.errorMessage = action.payload?.Message || "";
      state.loginSuccess = action.payload?.IsSuccess || true;
      state.isTokenValid = action.payload?.isTokenValid;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
