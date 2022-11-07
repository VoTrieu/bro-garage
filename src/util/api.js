import axios from "axios";

export async function getCustomers() {
  const response = await axios.get("/customer/get-pagination");
  return response?.data?.Result;
}

export function getCustomerDetail(customerId) {
  return axios.get("/customer/get-by-id", {
    params: {
      id: customerId,
    },
  });
}

export const createNewCustomer = (customer) => {
  return axios.post("/customer/add", customer);
};

export const updateCustomer = (customer) => {
  return axios.put("/customer/edit", customer);
};
