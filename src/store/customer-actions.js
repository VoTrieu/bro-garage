import axios from "axios";

export const sendCustomerData = (customer) => {
  return async (dispatch) => {
    axios.post('/customer/add', customer).then((response) => {
      console.log(response);
    });
  };
};
