import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { uiActions } from "./store/ui-slice";
import store from "./store/index";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { authActions } from "./store/auth-slice";
import { refreshToken } from "./store/auth-actions";

/*
  primereact config
*/
import "primereact/resources/themes/saga-green/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const currentAuthorization = localStorage.getItem("currentAuthorization");
store.dispatch(
  authActions.setCurrentAuthorization(JSON.parse(currentAuthorization))
);

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
const lastRequest = axios.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  config.headers.Authorization = token;
  return config;
});

axios.interceptors.response.use(
  (response) => {
    store.dispatch(
      uiActions.setToastContent({
        severity: "success",
        summary: "Success Message",
        detail: response.data.Message,
      })
    );
    return response;
  },
  (error) => {
    const {
      status,
      data: { message },
    } = error.response;
    const refreshTokenValue = store.getState().auth.refreshToken;
    if ((status === 401) & (message === "Unauthorized") && refreshTokenValue) {
      store.dispatch(refreshToken(refreshTokenValue));
      setTimeout(() => {
        return lastRequest;
      }, 1000);
    } else {
      store.dispatch(
        uiActions.setToastContent({
          severity: "error",
          summary: "Error Message!",
          detail: message,
        })
      );
    }
  }
);
// axios.defaults.headers.common['authorization'] = store.getState().auth.accessToken;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
