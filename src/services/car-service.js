import axios from "axios";

export const getCarTypes = () => {
  return axios.get("car-type/get-all");
}

export const getManufacturers = () =>{
    return axios.get("manufacturer/get-all");
  }
