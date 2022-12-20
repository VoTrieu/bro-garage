import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { uiActions } from "./store/ui-slice";
import { authActions } from "./store/auth-slice";
import { includes, endsWith } from "lodash";
import store from "./store/index";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

/*
  primereact config
*/
import "primereact/resources/themes/saga-green/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const currentAuthorization = JSON.parse(
  localStorage.getItem("currentAuthorization")
);

if(currentAuthorization){
  currentAuthorization.isTokenValid = false;
}

var requestNumber = 0;
var finishedRequestNumber = 0;
store.dispatch(authActions.setCurrentAuthorization(currentAuthorization));

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.interceptors.request.use((config) => {
  requestNumber++;
  store.dispatch(uiActions.showSpinner(true));
  const token = store.getState().auth.accessToken;
  config.headers.Authorization = token;
  return config;
});

axios.interceptors.response.use(
  (response) => {
    finishedRequestNumber++;
    //Export request return a file, so it does not have IsSuccess value
    if (response.data.IsSuccess || includes(response.config.url, 'export')) {
      if(response.config.method !== 'get' && !endsWith(response.config.url, 'refresh-token')){
        store.dispatch(
          uiActions.setToastContent({
            severity: "success",
            summary: "Success Message",
            detail: "Lưu thành công!",
          })
        );
      }
    } else {
      store.dispatch(
        uiActions.setToastContent({
          severity: "error",
          summary: "Error Message",
          detail: response.data.Message,
        })
      );
    }

    if (requestNumber === finishedRequestNumber) {
      store.dispatch(uiActions.showSpinner(false));
      requestNumber = 0;
      finishedRequestNumber = 0;
    }
    return response;
  },
  (error) => {
    finishedRequestNumber++;
    if (axios.isCancel(error)) {
      store.dispatch(uiActions.showSpinner(false));
      return;
    }

    const {
      status,
      data: { Message },
    } = error.response;

    finishedRequestNumber++;

    if ((status === 401) && (Message === "Unauthorized")) {
      window.location.href = "/";
    } else {
      store.dispatch(
        uiActions.setToastContent({
          severity: "error",
          summary: "Error Message!",
          detail: Message,
        })
      );
    }

    if (requestNumber === finishedRequestNumber) {
      store.dispatch(uiActions.showSpinner(false));
      requestNumber = 0;
      finishedRequestNumber = 0;
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
