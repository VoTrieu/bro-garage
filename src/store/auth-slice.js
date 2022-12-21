import { createSlice } from "@reduxjs/toolkit";
import { getTimestampInSeconds } from "../utils/Utils";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loginSuccess: true,
    errorMessage: "",
    fullName: "",
    accessToken: "",
    refreshToken: "",
    isTokenValid: false,
  },
  reducers: {
    setCurrentAuthorization(state, action) {
      state.fullName = action.payload?.Result?.FullName || "";
      state.accessToken = action.payload?.Result?.AccessToken || "";
      state.refreshToken = action.payload?.Result?.RefreshToken || "";
      state.errorMessage = action.payload?.Message || "";
      state.loginSuccess = action.payload ? action.payload.IsSuccess : true;
      const expirationTime = action.payload?.Result?.ExpirationTime;
      state.expirationTime = expirationTime;

      const currentTimeStamp = getTimestampInSeconds();
      if (currentTimeStamp < expirationTime) {
        state.isTokenValid = true;
      } else {
        state.isTokenValid = false;
      }
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
