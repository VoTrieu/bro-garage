import axios from "axios";

const baseUrl = "https://gm.radovietnam.net/Customer";
export const sendCustomerData = (customer) => {
  return async (dispatch) => {
    axios.post(`${baseUrl}/add`, customer).then((response) => {
      console.log(response);
    });
  };
};
