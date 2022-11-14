import axios from "axios";

export async function getCustomers(pageSize, pageIndex) {
  return axios.get("/customer/get-pagination", {
    params: { pageSize: pageSize || 10, pageIndex: pageIndex || 1 },
  });
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

export const deleteCustomer = (customerId) => {
  return axios.delete("/customer/delete", {
    params: { id: customerId },
  });
};
