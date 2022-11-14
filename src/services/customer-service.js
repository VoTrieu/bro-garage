import axios from "axios";

export async function getCustomers(
  pageSize = 10,
  pageIndex = 1,
  keyword = null
) {
  return axios.get("/customer/get-pagination", {
    params: {
      pageSize,
      pageIndex,
      keyword,
    },
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
