import axios from "axios";

export async function getCustomers() {
  const response = await axios.get("/customer/get-pagination");
  return response?.data?.Result;
}
