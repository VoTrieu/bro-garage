import axios from "axios";
import { authActions } from "./auth-slice";
import { uiActions } from "./ui-slice";

export const loginRequest = (account) => {
  return async (dispatch) => {
    axios.post("/user/login", account).then((response) => {
      const data = response.data;
      dispatch(authActions.setCurrentAuthorization(data));
      if (data.IsSuccess) {
        dispatch(uiActions.showLoginDialog(false));
        localStorage.setItem('currentAuthorization', JSON.stringify(data));
      }
    });
  };
};
