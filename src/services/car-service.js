import axios from "axios";

export const getCarTypes = () => {
  return axios.get("car-type/get-all");
};

export const getManufacturers = () => {
  return axios.get("manufacturer/get-all");
};

export const getCars = (
  pageSize = 10,
  pageIndex = 1,
  keyword = null,
  token = null
) => {
  return axios.get("/car/get-pagination", {
    params: {
      pageSize,
      pageIndex,
      keyword,
    },
    cancelToken: token,
  });
};
